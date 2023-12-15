import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Param,
    Post,
    Put,
    Query,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { InputShareCommentDTO } from '../../dto/share/comment/input-shareComment.dto';
import { InputShareCommentReplyDTO } from '../../dto/share/commentReply/input-shareCommentReply.dto';
import { InputSharePostDTO } from '../../dto/share/post/input-sharePost.dto';
import { IUserProfileDTO } from '../../dto/user/user/response-user.dto';
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

    /**
     *
     *  Post
     *
     */
    @Post('post')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('files', 5, { limits: { fieldSize: 25 * 1024 * 1024 } }))
    async createPostWithImages(
        @AuthUser() user: IUserProfileDTO,
        @UploadedFiles() files: Express.Multer.File[],
        @Body() dto: InputSharePostDTO,
    ) {
        try {
            return this.shareWriterService.createPostWithImages(user, dto, files);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Post('comment')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    async createComment(@AuthUser() user: IUserProfileDTO, @Body() dto: InputShareCommentDTO) {
        try {
            return this.shareWriterService.createComment(user, dto);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Post('comment-reply')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    async createCommentReply(@AuthUser() user: IUserProfileDTO, @Body() dto: InputShareCommentReplyDTO) {
        try {
            return this.shareWriterService.createCommentReply(user, dto);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Post('posts/:id/like')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    async createLike(@AuthUser() user: IUserProfileDTO, @Param('id') postId: string) {
        try {
            return this.shareWriterService.createLike(user, postId);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    /**
     *
     *  Put
     *
     */
    @Put('posts/:id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async updatePost(@AuthUser() user: IUserProfileDTO, @Param('id') postId: string, @Body() dto: InputSharePostDTO) {
        try {
            return this.shareUpdaterService.updatePost(user, postId, dto);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Put('comments/:id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async updateComment(@AuthUser() user: IUserProfileDTO, @Param('id') commentId: string, @Body() dto: InputShareCommentDTO) {
        try {
            return this.shareUpdaterService.updateComment(user, commentId, dto);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Put('comment-replies/:id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async updateCommentReply(
        @AuthUser() user: IUserProfileDTO,
        @Param('id') commentReplyId: string,
        @Body() dto: InputShareCommentReplyDTO,
    ) {
        try {
            return this.shareUpdaterService.updateCommentReply(user.id, commentReplyId, dto);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Put('posts/:id/like')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async toggleLike(@AuthUser() user: IUserProfileDTO, @Param('id') postId: string) {
        try {
            return this.shareUpdaterService.toggleLike(user.id, postId);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    /**
     *
     *  Delete
     *
     */
    @Delete('posts/:id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async deletePost(@AuthUser() user: IUserProfileDTO, @Param('id') postId: string) {
        try {
            return this.shareDeleterService.deletePost(user.id, postId);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Delete('comments/:id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async deleteComment(@AuthUser() user: IUserProfileDTO, @Param('id') commentId: string) {
        try {
            return this.shareDeleterService.deleteComment(user.id, commentId);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Delete('comment-replies/:id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async deleteCommentReply(@AuthUser() user: IUserProfileDTO, @Param('id') commentReplyId: string) {
        try {
            return this.shareDeleterService.deleteCommentReply(user.id, commentReplyId);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    /**
     *
     *  Get
     *
     */
    @Get('posts/list')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtOptionalAuthGuard)
    async getPostsInfiniteScroll(@AuthUser() user: IUserProfileDTO, @Query('pageParam') pageParam: number) {
        try {
            return this.shareSearcherService.getPostsInfiniteScroll(user?.id, pageParam, 10);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Get('posts/:id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtOptionalAuthGuard)
    async getPost(@AuthUser() user: IUserProfileDTO, @Param('id') postId: string) {
        try {
            return this.shareSearcherService.getPost(user.id, postId);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Get('posts/list/users/:nickname')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtOptionalAuthGuard)
    async getUserPostsInfiniteScroll(
        @AuthUser() user: IUserProfileDTO,
        @Param('nickname') targetNickname: string,
        @Query('pageParam') pageParam: number,
    ) {
        try {
            return this.shareSearcherService.getUserPostsInfiniteScroll(user?.id, targetNickname, pageParam, 12);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Get('posts/:id/comments/list')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtOptionalAuthGuard)
    async getCommentsInfiniteScroll(
        @AuthUser() user: IUserProfileDTO,
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
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtOptionalAuthGuard)
    async getCommentRepliesInfiniteScroll(
        @AuthUser() user: IUserProfileDTO,
        @Param('id') commentId: string,
        @Query('pageParam') pageParam: number,
    ) {
        try {
            return this.shareSearcherService.getCommentRepliesInfiniteScroll(user?.id, commentId, pageParam, 10);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Get('posts/:id/like/list')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtOptionalAuthGuard)
    async getLikeListForPostInfiniteScroll(
        @AuthUser() user: IUserProfileDTO,
        @Param('id') postId: string,
        @Query('pageParam') pageParam: number,
    ) {
        try {
            return this.shareSearcherService.getLikeListForPostInfiniteScroll(user.id, postId, pageParam, 10);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Get('posts/list/me')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async getMyPostsInfiniteScroll(@AuthUser() user: IUserProfileDTO, @Query('pageParam') pageParam: number) {
        try {
            return this.shareSearcherService.getMyPostsInfiniteScroll(user.id, pageParam, 12);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }
}
