import { PutObjectCommand, S3Client, DeleteObjectCommand, HeadObjectCommand, S3ClientConfig } from '@aws-sdk/client-s3';
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import * as mime from 'mime-types';
import { v4 as uuidv4 } from 'uuid';

export const ImageToS3ServiceToken = 'ImageToS3ServiceToken'

interface IS3ObjectParams {
    Key: string;
    Bucket: string;
}

@Injectable()
export class ImageToS3Service {
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

    // 이미지 업로드
    async uploadToS3(file: Express.Multer.File) {
        const key = `${uuidv4()}.${mime.extension(file.mimetype)}`;

        const uploadParams = {
            Bucket: process.env.AWS_BUCKET ?? '',
            Key: key,
            Body: file.buffer,
        };

        try {
            const uploadResult = await this.s3.send(new PutObjectCommand(uploadParams));

            if (uploadResult.$metadata.httpStatusCode !== 200) {
                throw new Error('Image upload failed');
            }

            return {
                key: key,
                location: `${process.env.AWS_IMAGE_BASEURL}${key}`,
                message: 'Image upload successful',
            };
        } catch (error) {
            console.log('Error uploading image:', error);
            throw new BadRequestException('Image upload failed');
        }
    }

    // 이미지 삭제
    async deleteFromS3(key: string) {
        const Params: IS3ObjectParams = {
            Bucket: process.env.AWS_BUCKET ?? '',
            Key: key,
        };

        const isKeyExists = await this.checkS3ObjectExists(Params);

        if (!isKeyExists) {
            throw new NotFoundException('Image not found.');
        }

        try {
            await this.s3.send(new DeleteObjectCommand(Params));
            return { key: key, message: 'Image deletion successful' };
        } catch (error) {
            console.log('Error deleting image:', error);
            throw new BadRequestException('Image deletion failed');
        }
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
