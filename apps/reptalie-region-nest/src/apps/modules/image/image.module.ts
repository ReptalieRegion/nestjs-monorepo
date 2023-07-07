import { Module } from '@nestjs/common';
import { MongooseModuleImage } from '../../utils/customModules';
import { ImageToS3ServiceProvider, ImageToTableServiceProvider } from './image.providers';
import { ImageRepository } from './image.repository';

@Module({
    imports: [MongooseModuleImage],
    controllers: [],
    providers: [ImageToS3ServiceProvider, ImageToTableServiceProvider, ImageRepository],
    exports: [ImageToS3ServiceProvider, ImageToTableServiceProvider, ImageRepository],
})
export class ImageModule {}
