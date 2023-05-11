import { Injectable, BadRequestException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { IResponseImageDTO } from '../../dto/image/response-image.dto';

interface IParams {
    Key: string;
    Bucket: string;
}

@Injectable()
export class ImageService {
    private readonly s3: S3;

    constructor() {
        this.s3 = new S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });
    }

    async uploadS3Object(file: Express.MulterS3.File): Promise<IResponseImageDTO> {
        if (!file) {
            throw new BadRequestException('파일이 존재하지 않습니다.');
        }

        return { key: file.key, location: file.location, message: 'S3에 이미지 업로드되었습니다.' };
    }

    async deleteS3Object(key: string): Promise<IResponseImageDTO> {
        const params: IParams = {
            Key: key,
            Bucket: process.env.AWS_BUCKET ?? '',
        };

        const isKeyExists = await this.checkS3ObjectExists(params);

        if (!isKeyExists) {
            throw new BadRequestException('파일이 존재하지 않아 삭제에 실패했습니다.');
        }

        await this.s3.deleteObject(params).promise();
        return { key: key, message: '해당 이미지를 삭제했습니다.' };
    }

    private async checkS3ObjectExists(params: IParams): Promise<boolean> {
        try {
            await this.s3.headObject(params).promise();
            return true;
        } catch (error) {
            return false;
        }
    }
}
