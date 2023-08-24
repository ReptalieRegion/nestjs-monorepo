import { PutObjectCommand, S3Client, DeleteObjectCommand, HeadObjectCommand, S3ClientConfig } from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as mime from 'mime-types';
import { v4 as uuidv4 } from 'uuid';

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

    // 이미지 삭제
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
                throw new NotFoundException('Image not found.');
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
                throw new InternalServerErrorException('Image deletion failed after multiple retries');
            }
        }

        return deleteResults;
    }

    // 이미지 업로드
    async uploadToS3(files: Express.Multer.File[]) {
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
                if (imageKeys.length !== 0) {
                    await this.deleteImagesFromS3(imageKeys);
                }
                throw new InternalServerErrorException('Image upload failed after multiple retries');
            }
        }

        return imageKeys;
    }

    private async checkS3ObjectExists(params: IS3ObjectParams) {
        try {
            await this.s3.send(new HeadObjectCommand(params));
            return true;
        } catch (error) {
            return false;
        }
    }
}
