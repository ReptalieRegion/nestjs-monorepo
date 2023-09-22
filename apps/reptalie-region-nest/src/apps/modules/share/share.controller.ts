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
    Get,
    Query,
    HttpCode,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { InputShareCommentDTO } from '../../dto/share/comment/input-shareComment.dto';
import { InputShareCommentReplyDTO } from '../../dto/share/commentReply/input-shareCommentReply.dto';
import { InputSharePostDTO } from '../../dto/share/post/input-sharePost.dto';
import { IResponseUserDTO } from '../../dto/user/response-user.dto';
import { controllerErrorHandler } from '../../utils/error/errorHandler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtOptionalAuthGuard } from '../auth/guards/jwtOptional-auth.guard';
import { AuthUser } from '../user/user.decorator';
import { ShareDeleterService, ShareDeleterServiceToken } from './service/shareDeleter.service';
import { ShareSearcherService, ShareSearcherServiceToken } from './service/shareSearcher.service';
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
        @Inject(ShareSearcherServiceToken)
        private readonly shareSearcherService: ShareSearcherService,
    ) {}

    @Post('post')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FilesInterceptor('files', 5))
    async createPostWithImages(
        @AuthUser() user: IResponseUserDTO,
        @UploadedFiles() files: Express.Multer.File[],
        @Body() inputSharePostDTO: InputSharePostDTO,
    ) {
        try {
            return this.shareWriterService.createPostWithImages(user, inputSharePostDTO, files);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Post('comment')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async createComment(@AuthUser() user: IResponseUserDTO, @Body() inputShareCommentDTO: InputShareCommentDTO) {
        try {
            return this.shareWriterService.createComment(user, inputShareCommentDTO);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Post('comment-reply')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async createCommentReply(@AuthUser() user: IResponseUserDTO, @Body() inputShareCommentReplyDTO: InputShareCommentReplyDTO) {
        try {
            return this.shareWriterService.createCommentReply(user, inputShareCommentReplyDTO);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Post('posts/:id/like')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async createLike(@AuthUser() user: IResponseUserDTO, @Param('id') postId: string) {
        try {
            return this.shareWriterService.createLike(user.id, postId);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Put('posts/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async updatePost(
        @AuthUser() user: IResponseUserDTO,
        @Param('id') postId: string,
        @Body() inputSharePostDTO: InputSharePostDTO,
    ) {
        try {
            return this.shareUpdaterService.updatePost(user, postId, inputSharePostDTO);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Put('comments/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async updateComment(
        @AuthUser() user: IResponseUserDTO,
        @Param('id') commentId: string,
        @Body() inputShareCommentDTO: InputShareCommentDTO,
    ) {
        try {
            return this.shareUpdaterService.updateComment(user.id, commentId, inputShareCommentDTO);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Put('comment-replies/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async updateCommentReply(
        @AuthUser() user: IResponseUserDTO,
        @Param('id') commentReplyId: string,
        @Body() inputShareCommentReplyDTO: InputShareCommentReplyDTO,
    ) {
        try {
            return this.shareUpdaterService.updateCommentReply(user.id, commentReplyId, inputShareCommentReplyDTO);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Put('posts/:id/like')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async toggleLike(@AuthUser() user: IResponseUserDTO, @Param('id') postId: string) {
        try {
            return this.shareUpdaterService.toggleLike(user.id, postId);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Delete('posts/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async deletePost(@AuthUser() user: IResponseUserDTO, @Param('id') postId: string) {
        try {
            return this.shareDeleterService.deletePost(user.id, postId);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Delete('comments/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async deleteComment(@AuthUser() user: IResponseUserDTO, @Param('id') commentId: string) {
        try {
            return this.shareDeleterService.deleteComment(user.id, commentId);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Delete('comment-replies/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async deleteCommentReply(@AuthUser() user: IResponseUserDTO, @Param('id') commentReplyId: string) {
        try {
            return this.shareDeleterService.deleteCommentReply(user.id, commentReplyId);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Get('posts/list')
    @UseGuards(JwtOptionalAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getPostsInfiniteScroll(@AuthUser() user: IResponseUserDTO, @Query('pageParam') pageParam: number) {
        try {
            return this.shareSearcherService.getPostsInfiniteScroll(user?.id, pageParam, 10);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Get('posts/list/users/:nickname')
    @UseGuards(JwtOptionalAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getUserPostsInfiniteScroll(
        @AuthUser() user: IResponseUserDTO,
        @Param('nickname') targetNickname: string,
        @Query('pageParam') pageParam: number,
    ) {
        try {
            return this.shareSearcherService.getUserPostsInfiniteScroll(user?.id, targetNickname, pageParam, 10);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Get('posts/:id/comments/list')
    @UseGuards(JwtOptionalAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getCommentsInfiniteScroll(
        @AuthUser() user: IResponseUserDTO,
        @Param('id') postId: string,
        @Query('pageParam') pageParam: number,
    ) {
        try {
            return this.shareSearcherService.getCommentsInfiniteScroll(user?.id, postId, pageParam, 10);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Get('comments/:id/replies/list')
    @UseGuards(JwtOptionalAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getCommentRepliesInfiniteScroll(
        @AuthUser() user: IResponseUserDTO,
        @Param('id') commentId: string,
        @Query('pageParam') pageParam: number,
    ) {
        try {
            return await this.shareSearcherService.getCommentRepliesInfiniteScroll(user?.id, commentId, pageParam, 10);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }
}
