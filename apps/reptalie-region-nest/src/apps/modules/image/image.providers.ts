import { ImageToS3Service, ImageToS3ServiceToken } from './imageToS3.service';
import { ImageToTableService, ImageToTableServiceToken } from './imageToTable.service';

export const ImageToS3ServiceProvider = {
    provide: ImageToS3ServiceToken,
    useClass: ImageToS3Service,
};

export const ImageToTableServiceProvider = {
    provide: ImageToTableServiceToken,
    useClass: ImageToTableService,
};
