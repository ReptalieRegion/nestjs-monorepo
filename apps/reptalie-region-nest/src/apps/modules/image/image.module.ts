import { Module } from '@nestjs/common';
import { MongooseModuleImage } from '../../utils/customModules';
import { ImageDeleterServiceProvicer, ImageS3HandlerServiceProvider, ImageWriterServiceProvider } from './image.providers';
import { ImageRepository } from './image.repository';

@Module({
    imports: [MongooseModuleImage],
    controllers: [],
    providers: [ImageRepository, ImageS3HandlerServiceProvider, ImageWriterServiceProvider, ImageDeleterServiceProvicer],
    exports: [ImageRepository, ImageS3HandlerServiceProvider, ImageWriterServiceProvider, ImageDeleterServiceProvicer],
})
export class ImageModule {}
