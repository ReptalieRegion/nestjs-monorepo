import { Controller, Post, UseInterceptors, UploadedFiles, Body, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { InputSharePostDTO } from '../../dto/sharePost/input-sharePost.dto';
import { ShareWriterService, ShareWriterServiceToken } from './service/shareWriter.service';

@Controller('share')
export class ShareController {
    constructor(
        @Inject(ShareWriterServiceToken)
        private readonly shareWriterService: ShareWriterService,
    ) {}

    @Post('post')
    @UseInterceptors(FilesInterceptor('files', 5))
    async createSharePostWithImages(
        @UploadedFiles() files: Express.Multer.File[],
        @Body('sharePost') inputSharePostDTO: InputSharePostDTO,
    ) {
        try {
            await this.shareWriterService.createSharePostWithImages(inputSharePostDTO, files);
            return { statusCode: HttpStatus.CREATED, message: 'Share post created successfully' };
        } catch (error) {            
            if (error instanceof Error) {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
            }
            throw new HttpException('Unknown error occurred', HttpStatus.BAD_REQUEST);
        }
    }
}
