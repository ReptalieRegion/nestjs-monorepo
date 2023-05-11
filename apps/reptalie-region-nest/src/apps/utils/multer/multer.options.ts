import { S3Client } from '@aws-sdk/client-s3';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as mime from 'mime-types';
import s3Storage from 'multer-s3';
import * as multerS3 from 'multer-s3';

export const multerOptionsFactory = (): MulterOptions => {
    const s3 = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
        },
    });

    return {
        storage: s3Storage({
            s3,
            bucket: process.env.AWS_BUCKET ?? '',
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: function (req, file, cb) {
                cb(null, `${new Date().getTime()}.${mime.extension(file.mimetype)}`);
            },
        }),
        limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    };
};
