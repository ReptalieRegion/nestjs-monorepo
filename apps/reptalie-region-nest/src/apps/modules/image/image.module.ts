import { Module } from '@nestjs/common';
import { CustomMulterModule } from '../../utils/customModules';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';

@Module({
    imports: [CustomMulterModule],
    controllers: [ImageController],
    providers: [ImageService],
    exports: [ImageService],
})
export class ImageModule {}
