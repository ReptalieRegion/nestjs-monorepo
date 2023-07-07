import { Controller, Post, UseInterceptors, UploadedFiles, Body, Inject } from '@nestjs/common';
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
        await this.shareWriterService.createSharePostWithImages(inputSharePostDTO, files);
    }
}
