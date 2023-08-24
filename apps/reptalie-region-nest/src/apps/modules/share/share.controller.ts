import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFiles,
    Body,
    Inject,
    HttpException,
    HttpStatus,
    UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { InputShareCommentDTO } from '../../dto/share/comment/input-shareComment.dto';
import { InputShareCommentReplyDTO } from '../../dto/share/commentReply/input-shareCommentReply.dto';
import { InputSharePostDTO } from '../../dto/share/post/input-sharePost.dto';
import { IResponseUserDTO } from '../../dto/user/response-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUser } from '../user/user.decorator';
import { ShareWriterService, ShareWriterServiceToken } from './service/shareWriter.service';

@Controller('share')
export class ShareController {
    constructor(
        @Inject(ShareWriterServiceToken)
        private readonly shareWriterService: ShareWriterService,
    ) {}

    @Post('post')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('files', 5))
    async createSharePostWithImages(
        @AuthUser() user: IResponseUserDTO,
        @UploadedFiles()
        files: Express.Multer.File[],
        @Body() inputSharePostDTO: InputSharePostDTO,
    ) {
        try {
            await this.shareWriterService.createSharePostWithImages(user.id, inputSharePostDTO, files);

            return { statusCode: HttpStatus.CREATED, message: 'Share post created successfully' };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Unknown error occurred', HttpStatus.BAD_REQUEST);
        }
    }

    @Post('comment')
    @UseGuards(JwtAuthGuard)
    async createShareComment(@AuthUser() user: IResponseUserDTO, @Body() inputShareCommentDTO: InputShareCommentDTO) {
        try {
            await this.shareWriterService.createShareComment(user.id, inputShareCommentDTO);

            return { statusCode: HttpStatus.CREATED, message: 'Comment created successfully' };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Unknown error occurred', HttpStatus.BAD_REQUEST);
        }
    }

    @Post('comment-reply')
    @UseGuards(JwtAuthGuard)
    async createShareCommentReply(
        @AuthUser() user: IResponseUserDTO,
        @Body() inputShareCommentReplyDTO: InputShareCommentReplyDTO,
    ) {
        try {
            await this.shareWriterService.createShareCommentReply(user.id, inputShareCommentReplyDTO);

            return { statusCode: HttpStatus.CREATED, message: 'Comment Reply created successfully' };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Unknown error occurred', HttpStatus.BAD_REQUEST);
        }
    }
}
