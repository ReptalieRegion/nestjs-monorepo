import { Module } from '@nestjs/common';
import { MongooseModuleImage } from '../../utils/customModules';
import {
    ImageDeleterServiceProvider,
    ImageS3HandlerServiceProvider,
    ImageSearcherServiceProvider,
    ImageWriterServiceProvider,
} from './image.providers';
import { ImageRepository } from './image.repository';

@Module({
    imports: [MongooseModuleImage],
    controllers: [],
    providers: [
        ImageRepository,
        ImageS3HandlerServiceProvider,
        ImageWriterServiceProvider,
        ImageDeleterServiceProvider,
        ImageSearcherServiceProvider,
    ],
    exports: [
        ImageS3HandlerServiceProvider,
        ImageWriterServiceProvider,
        ImageDeleterServiceProvider,
        ImageSearcherServiceProvider,
    ],
})
export class ImageModule {}
