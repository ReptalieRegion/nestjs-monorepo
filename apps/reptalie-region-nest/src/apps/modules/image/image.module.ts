import { Module } from '@nestjs/common';
import { MongooseModuleImage } from '../../utils/customModules';
import {
    ImageDeleterServiceProvider,
    ImageS3HandlerServiceProvider,
    ImageSearcherServiceProvider,
    ImageUpdaterServiceProvider,
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
        ImageUpdaterServiceProvider,
    ],
    exports: [
        ImageS3HandlerServiceProvider,
        ImageWriterServiceProvider,
        ImageDeleterServiceProvider,
        ImageSearcherServiceProvider,
        ImageUpdaterServiceProvider,
    ],
})
export class ImageModule {}
