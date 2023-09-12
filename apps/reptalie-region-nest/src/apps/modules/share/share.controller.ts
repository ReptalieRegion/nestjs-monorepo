import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFiles,
    Body,
    Inject,
    HttpStatus,
    UseGuards,
    Put,
    Param,
    Delete,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { InputShareCommentDTO } from '../../dto/share/comment/input-shareComment.dto';
import { InputShareCommentReplyDTO } from '../../dto/share/commentReply/input-shareCommentReply.dto';
import { InputSharePostDTO } from '../../dto/share/post/input-sharePost.dto';
import { IResponseUserDTO } from '../../dto/user/response-user.dto';
import { controllerErrorHandler } from '../../utils/error/errorHandler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUser } from '../user/user.decorator';
import { ShareDeleterService, ShareDeleterServiceToken } from './service/shareDeleter.service';
import { ShareUpdaterService, ShareUpdaterServiceToken } from './service/shareUpdater.service';
import { ShareWriterService, ShareWriterServiceToken } from './service/shareWriter.service';

@Controller('share')
export class ShareController {
    constructor(
        @Inject(ShareWriterServiceToken)
        private readonly shareWriterService: ShareWriterService,
        @Inject(ShareUpdaterServiceToken)
        private readonly shareUpdaterService: ShareUpdaterService,
        @Inject(ShareDeleterServiceToken)
        private readonly shareDeleterService: ShareDeleterService,
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
            return { statusCode: HttpStatus.CREATED, message: 'SharePost created successfully' };
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Post('comment')
    @UseGuards(JwtAuthGuard)
    async createShareComment(@AuthUser() user: IResponseUserDTO, @Body() inputShareCommentDTO: InputShareCommentDTO) {
        try {
            await this.shareWriterService.createShareComment(user.id, inputShareCommentDTO);
            return { statusCode: HttpStatus.CREATED, message: 'ShareComment created successfully' };
        } catch (error) {
            controllerErrorHandler(error);
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
            return { statusCode: HttpStatus.CREATED, message: 'ShareCommentReply created successfully' };
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Post('posts/:id/like')
    @UseGuards(JwtAuthGuard)
    async createShareLike(@AuthUser() user: IResponseUserDTO, @Param('id') postId: string) {
        try {
            await this.shareWriterService.createShareLike(user.id, postId);
            return { statusCode: HttpStatus.CREATED, message: 'ShareLike created successfully' };
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Put('posts/:id/like')
    @UseGuards(JwtAuthGuard)
    async toggleShareLike(@AuthUser() user: IResponseUserDTO, @Param('id') postId: string) {
        try {
            await this.shareUpdaterService.toggleShareLike(user.id, postId);
            return { statusCode: HttpStatus.OK, message: 'ShareLike toggled successfully' };
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Put('posts/:id')
    @UseGuards(JwtAuthGuard)
    async updateSharePost(
        @AuthUser() user: IResponseUserDTO,
        @Param('id') postId: string,
        @Body() inputSharePostDTO: InputSharePostDTO,
    ) {
        try {
            await this.shareUpdaterService.updateSharePost(user.id, postId, inputSharePostDTO);
            return { statusCode: HttpStatus.OK, message: 'SharePost updated successfully' };
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Put('comments/:id')
    @UseGuards(JwtAuthGuard)
    async updateShareComment(
        @AuthUser() user: IResponseUserDTO,
        @Param('id') commentId: string,
        @Body() inputShareCommentDTO: InputShareCommentDTO,
    ) {
        try {
            await this.shareUpdaterService.updateShareComment(user.id, commentId, inputShareCommentDTO);
            return { statusCode: HttpStatus.OK, message: 'ShareComment updated successfully' };
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Put('comment-replies/:id')
    @UseGuards(JwtAuthGuard)
    async updateShareCommentReply(
        @AuthUser() user: IResponseUserDTO,
        @Param('id') commentReplyId: string,
        @Body() inputShareCommentReplyDTO: InputShareCommentReplyDTO,
    ) {
        try {
            await this.shareUpdaterService.updateShareCommentReply(user.id, commentReplyId, inputShareCommentReplyDTO);
            return { statusCode: HttpStatus.OK, message: 'ShareCommentReply updated successfully' };
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Delete('posts/:id')
    @UseGuards(JwtAuthGuard)
    async deleteSharePost(@AuthUser() user: IResponseUserDTO, @Param('id') postId: string) {
        try {
            const post = await this.shareDeleterService.deleteSharePost(user.id, postId);
            return { statusCode: HttpStatus.OK, response: post };
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Delete('comments/:id')
    @UseGuards(JwtAuthGuard)
    async deleteShareComment(@AuthUser() user: IResponseUserDTO, @Param('id') commentId: string) {
        try {
            const comment = await this.shareDeleterService.deleteShareComment(user.id, commentId);
            return { statusCode: HttpStatus.OK, response: comment };
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Delete('comment-replies/:id')
    @UseGuards(JwtAuthGuard)
    async deleteShareCommentReply(@AuthUser() user: IResponseUserDTO, @Param('id') commentReplyId: string) {
        try {
            const commentReply = await this.shareDeleterService.deleteShareCommentReply(user.id, commentReplyId);
            return { statusCode: HttpStatus.OK, response: commentReply };
        } catch (error) {
            controllerErrorHandler(error);
        }
    }
}
