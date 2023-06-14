import { Module } from '@nestjs/common';
import { MongooseModuleImage } from '../../utils/customModules';
import { ImageToS3ServiceProvider } from './image.providers';
import { ImageRepository } from './image.repository';

@Module({
    imports: [MongooseModuleImage],
    controllers: [],
    providers: [ImageToS3ServiceProvider, ImageRepository],
    exports: [],
})
export class ImageModule {}
