import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeleteImageDTO } from '../../dto/image/delete-image.dto';
import { IResponseImageDTO } from '../../dto/image/response-image.dto';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
    constructor(private readonly imageService: ImageService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadS3Object(@UploadedFile() file: Express.MulterS3.File): Promise<IResponseImageDTO> {
        return this.imageService.uploadS3Object(file);
    }

    @Post('delete')
    async deleteS3Object(@Body() deleteImageDTO: DeleteImageDTO): Promise<IResponseImageDTO> {
        return this.imageService.deleteS3Object(deleteImageDTO.key);
    }
}
