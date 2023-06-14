import { ImageToS3Service, ImageToS3ServiceToken } from './imageToS3.service';

export const ImageToS3ServiceProvider = {
    provide: ImageToS3ServiceToken,
    useClass: ImageToS3Service,
};
