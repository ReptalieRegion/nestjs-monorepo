import { Module } from '@nestjs/common';
import { MongooseModuleImage } from '../../utils/customModules';
import { ImageS3HandlerServiceProvider, ImageWriterServiceProvider } from './image.providers';
import { ImageRepository } from './image.repository';

@Module({
    imports: [MongooseModuleImage],
    controllers: [],
    providers: [ImageRepository, ImageS3HandlerServiceProvider, ImageWriterServiceProvider],
    exports: [ImageRepository, ImageS3HandlerServiceProvider, ImageWriterServiceProvider],
})
export class ImageModule {}
