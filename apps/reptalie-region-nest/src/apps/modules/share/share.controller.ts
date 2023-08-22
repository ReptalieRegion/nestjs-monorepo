import { Controller, Post, UseInterceptors, UploadedFiles, Body, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { InputShareCommentDTO } from '../../dto/share/comment/input-shareComment.dto';
import { InputShareCommentReplyDTO } from '../../dto/share/commentReply/input-shareCommentReply.dto';
import { InputSharePostDTO } from '../../dto/share/post/input-sharePost.dto';
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
        @Body() inputSharePostDTO: InputSharePostDTO,
    ) {
        try {
            await this.shareWriterService.createSharePostWithImages(inputSharePostDTO, files);

            return { statusCode: HttpStatus.CREATED, message: 'Share post created successfully' };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Unknown error occurred', HttpStatus.BAD_REQUEST);
        }
    }

    @Post('comment')
    async createShareComment(@Body() inputShareCommentDTO: InputShareCommentDTO) {
        try {
            await this.shareWriterService.createShareComment(inputShareCommentDTO);

            return { statusCode: HttpStatus.CREATED, message: 'Comment created successfully' };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Unknown error occurred', HttpStatus.BAD_REQUEST);
        }
    }

    @Post('comment-reply')
    async createShareCommentReply(@Body() inputShareCommentReplyDTO: InputShareCommentReplyDTO) {
        try {
            await this.shareWriterService.createShareCommentReply(inputShareCommentReplyDTO);

            return { statusCode: HttpStatus.CREATED, message: 'Comment Reply created successfully' };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Unknown error occurred', HttpStatus.BAD_REQUEST);
        }
    }
}
