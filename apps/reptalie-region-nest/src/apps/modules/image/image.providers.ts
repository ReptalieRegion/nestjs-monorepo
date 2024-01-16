import { ImageDeleterService, ImageDeleterServiceToken } from './service/imageDeleter.service';
import { ImageS3HandlerService, ImageS3HandlerServiceToken } from './service/imageS3Handler.service';
import { ImageSearcherService, ImageSearcherServiceToken } from './service/imageSearcher.service';
import { ImageUpdaterService, ImageUpdaterServiceToken } from './service/imageUpdater.service';
import { ImageWriterService, ImageWriterServiceToken } from './service/imageWriter.service';

export const ImageS3HandlerServiceProvider = {
    provide: ImageS3HandlerServiceToken,
    useClass: ImageS3HandlerService,
};

export const ImageWriterServiceProvider = {
    provide: ImageWriterServiceToken,
    useClass: ImageWriterService,
};

export const ImageDeleterServiceProvider = {
    provide: ImageDeleterServiceToken,
    useClass: ImageDeleterService,
};

export const ImageSearcherServiceProvider = {
    provide: ImageSearcherServiceToken,
    useClass: ImageSearcherService,
};

export const ImageUpdaterServiceProvider = {
    provide: ImageUpdaterServiceToken,
    useClass: ImageUpdaterService,
};
