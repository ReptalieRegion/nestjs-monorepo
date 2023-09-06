import { ImageDeleterService, ImageDeleterServiceToken } from './service/imageDeleter.service';
import { ImageS3HandlerService, ImageS3HandlerServiceToken } from './service/imageS3Handler.service';
import { ImageWriterService, ImageWriterServiceToken } from './service/imageWriter.service';

export const ImageS3HandlerServiceProvider = {
    provide: ImageS3HandlerServiceToken,
    useClass: ImageS3HandlerService,
};

export const ImageWriterServiceProvider = {
    provide: ImageWriterServiceToken,
    useClass: ImageWriterService,
};

export const ImageDeleterServiceProvicer = {
    provide: ImageDeleterServiceToken,
    useClass: ImageDeleterService,
};
