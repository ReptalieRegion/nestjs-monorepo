import { DeleteObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { HttpStatus, Injectable } from '@nestjs/common';
import * as mime from 'mime-types';
import { v4 as uuidv4 } from 'uuid';
import { CustomException } from '../../../utils/error/customException';

export const ImageS3HandlerServiceToken = 'ImageS3HandlerServiceToken';

interface IS3ObjectParams {
    Key: string;
    Bucket: string;
}

interface DeleteResult {
    key: string;
    message: string;
}

const MAX_RETRIES = 3;

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

@Injectable()
export class ImageS3HandlerService {
    private s3: S3Client;

    constructor() {
        const awsConfig: S3ClientConfig = {
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
            },
            region: process.env.AWS_REGION,
        };

        this.s3 = new S3Client(awsConfig);
    }

    /**
     * Amazon S3에서 주어진 키 배열에 해당하는 이미지를 삭제합니다.
     *
     * @param keys 삭제할 이미지의 키 배열
     * @returns 삭제 결과 객체 배열을 반환합니다.
     */
    async deleteImagesFromS3(keys: string[]) {
        if (keys.length === 0) {
            return;
        }

        const deleteResults: DeleteResult[] = [];

        for (const key of keys) {
            const Params: IS3ObjectParams = {
                Bucket: process.env.AWS_BUCKET ?? '',
                Key: key,
            };

            const isKeyExists = await this.checkS3ObjectExists(Params);

            if (!isKeyExists) {
                throw new CustomException('S3 Image does not exist.', HttpStatus.NOT_FOUND, -5301);
            }

            let retries = 0;

            while (retries < MAX_RETRIES) {
                try {
                    await this.s3.send(new DeleteObjectCommand(Params));
                    deleteResults.push({ key: key, message: 'Image deletion successful' });
                    break;
                } catch (error) {
                    retries++;
                    console.log(`Image deletion failed, retrying... Retry count: ${retries}`);
                    await delay(retries * 5 * 1000);
                }
            }

            if (retries === MAX_RETRIES) {
                throw new CustomException(
                    'Image deletion failed after multiple retries.',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    -5604,
                );
            }
        }

        return deleteResults;
    }

    /**
     * 주어진 파일들을 Amazon S3 (Simple Storage Service)에 업로드합니다.
     *
     * @param files Express 파일 객체의 배열, 업로드할 파일들
     * @returns 업로드된 이미지의 고유한 키 배열을 반환합니다.
     */
    async uploadToS3(files: Express.Multer.File[]) {
        if (files === undefined || files.length === 0) {
            throw new CustomException('No files were uploaded.', HttpStatus.BAD_REQUEST, -5001);
        }

        const imageKeys: string[] = [];

        for (const file of files) {
            const key = `${uuidv4()}.${mime.extension(file.mimetype)}`;

            const uploadParams = {
                Bucket: process.env.AWS_BUCKET ?? '',
                Key: key,
                Body: file.buffer,
            };

            let retries = 0;

            while (retries < MAX_RETRIES) {
                try {
                    const uploadResult = await this.s3.send(new PutObjectCommand(uploadParams));

                    if (uploadResult.$metadata.httpStatusCode !== 200) {
                        throw new Error('Image upload failed');
                    }

                    imageKeys.push(key);
                    break;
                } catch (error) {
                    retries++;
                    console.log(`Image upload failed, retrying... Retry count: ${retries}`);
                    await delay(retries * 5 * 1000);
                }
            }

            if (retries === MAX_RETRIES) {
                await this.deleteImagesFromS3(imageKeys);
                throw new CustomException(
                    'Image upload failed after multiple retries.',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    -5605,
                );
            }
        }

        return imageKeys;
    }

    /**
     * 주어진 S3 객체 파라미터로 S3 버킷에서 객체(이미지)가 존재하는지 확인합니다.
     *
     * @param params S3 객체(이미지)를 확인하기 위한 파라미터
     * @returns S3 버킷에 객체(이미지)가 존재하면 true를 반환하고, 그렇지 않으면 false를 반환합니다.
     */
    private async checkS3ObjectExists(params: IS3ObjectParams) {
        try {
            await this.s3.send(new HeadObjectCommand(params));
            return true;
        } catch (error) {
            return false;
        }
    }
}
