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
    async createPostWithImages(
        @AuthUser() user: IResponseUserDTO,
        @UploadedFiles()
        files: Express.Multer.File[],
        @Body() inputSharePostDTO: InputSharePostDTO,
    ) {
        try {
            await this.shareWriterService.createPostWithImages(user.id, inputSharePostDTO, files);
            return { statusCode: HttpStatus.CREATED, message: 'SharePost created successfully' };
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Post('comment')
    @UseGuards(JwtAuthGuard)
    async createComment(@AuthUser() user: IResponseUserDTO, @Body() inputShareCommentDTO: InputShareCommentDTO) {
        try {
            await this.shareWriterService.createComment(user.id, inputShareCommentDTO);
            return { statusCode: HttpStatus.CREATED, message: 'ShareComment created successfully' };
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Post('comment-reply')
    @UseGuards(JwtAuthGuard)
    async createCommentReply(@AuthUser() user: IResponseUserDTO, @Body() inputShareCommentReplyDTO: InputShareCommentReplyDTO) {
        try {
            await this.shareWriterService.createCommentReply(user.id, inputShareCommentReplyDTO);
            return { statusCode: HttpStatus.CREATED, message: 'ShareCommentReply created successfully' };
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Post('posts/:id/like')
    @UseGuards(JwtAuthGuard)
    async createLike(@AuthUser() user: IResponseUserDTO, @Param('id') postId: string) {
        try {
            await this.shareWriterService.createLike(user.id, postId);
            return { statusCode: HttpStatus.CREATED, message: 'ShareLike created successfully' };
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Put('posts/:id/like')
    @UseGuards(JwtAuthGuard)
    async toggleLike(@AuthUser() user: IResponseUserDTO, @Param('id') postId: string) {
        try {
            await this.shareUpdaterService.toggleLike(user.id, postId);
            return { statusCode: HttpStatus.OK, message: 'ShareLike toggled successfully' };
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Put('posts/:id')
    @UseGuards(JwtAuthGuard)
    async updatePost(
        @AuthUser() user: IResponseUserDTO,
        @Param('id') postId: string,
        @Body() inputSharePostDTO: InputSharePostDTO,
    ) {
        try {
            await this.shareUpdaterService.updatePost(user.id, postId, inputSharePostDTO);
            return { statusCode: HttpStatus.OK, message: 'SharePost updated successfully' };
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Put('comments/:id')
    @UseGuards(JwtAuthGuard)
    async updateComment(
        @AuthUser() user: IResponseUserDTO,
        @Param('id') commentId: string,
        @Body() inputShareCommentDTO: InputShareCommentDTO,
    ) {
        try {
            await this.shareUpdaterService.updateComment(user.id, commentId, inputShareCommentDTO);
            return { statusCode: HttpStatus.OK, message: 'ShareComment updated successfully' };
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Put('comment-replies/:id')
    @UseGuards(JwtAuthGuard)
    async updateCommentReply(
        @AuthUser() user: IResponseUserDTO,
        @Param('id') commentReplyId: string,
        @Body() inputShareCommentReplyDTO: InputShareCommentReplyDTO,
    ) {
        try {
            await this.shareUpdaterService.updateCommentReply(user.id, commentReplyId, inputShareCommentReplyDTO);
            return { statusCode: HttpStatus.OK, message: 'ShareCommentReply updated successfully' };
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Delete('posts/:id')
    @UseGuards(JwtAuthGuard)
    async deletePost(@AuthUser() user: IResponseUserDTO, @Param('id') postId: string) {
        try {
            const post = await this.shareDeleterService.deletePost(user.id, postId);
            return { statusCode: HttpStatus.OK, response: post };
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Delete('comments/:id')
    @UseGuards(JwtAuthGuard)
    async deleteComment(@AuthUser() user: IResponseUserDTO, @Param('id') commentId: string) {
        try {
            const comment = await this.shareDeleterService.deleteComment(user.id, commentId);
            return { statusCode: HttpStatus.OK, response: comment };
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Delete('comment-replies/:id')
    @UseGuards(JwtAuthGuard)
    async deleteCommentReply(@AuthUser() user: IResponseUserDTO, @Param('id') commentReplyId: string) {
        try {
            const commentReply = await this.shareDeleterService.deleteCommentReply(user.id, commentReplyId);
            return { statusCode: HttpStatus.OK, response: commentReply };
        } catch (error) {
            controllerErrorHandler(error);
        }
    }
}
