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
import { ValidationPipe } from '../../utils/error/validator/validator.pipe';
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
        @Body(new ValidationPipe(-2501)) dto: InputSharePostDTO,
    ) {
        return this.shareWriterService.createPostWithImages(user, dto, files);
    }

    @Post('comment')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    async createComment(@AuthUser() user: IUserProfileDTO, @Body(new ValidationPipe(-2502)) dto: InputShareCommentDTO) {
        return this.shareWriterService.createComment(user, dto);
    }

    @Post('comment-reply')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    async createCommentReply(
        @AuthUser() user: IUserProfileDTO,
        @Body(new ValidationPipe(-2503)) dto: InputShareCommentReplyDTO,
    ) {
        return this.shareWriterService.createCommentReply(user, dto);
    }

    @Post('posts/:postId/like')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    async createLike(@AuthUser() user: IUserProfileDTO, @Param('postId') postId: string) {
        return this.shareWriterService.createLike(user, postId);
    }

    /**
     *
     *  Put
     *
     */
    @Put('posts/:postId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async updatePost(
        @AuthUser() user: IUserProfileDTO,
        @Param('postId') postId: string,
        @Body(new ValidationPipe(-2501)) dto: InputSharePostDTO,
    ) {
        return this.shareUpdaterService.updatePost(user, postId, dto);
    }

    @Put('comments/:commentId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async updateComment(
        @AuthUser() user: IUserProfileDTO,
        @Param('commentId') commentId: string,
        @Body(new ValidationPipe(-2502)) dto: InputShareCommentDTO,
    ) {
        return this.shareUpdaterService.updateComment(user, commentId, dto);
    }

    @Put('comment-replies/:commentReplyId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async updateCommentReply(
        @AuthUser() user: IUserProfileDTO,
        @Param('commentReplyId') commentReplyId: string,
        @Body(new ValidationPipe(-2503)) dto: InputShareCommentReplyDTO,
    ) {
        return this.shareUpdaterService.updateCommentReply(user.id, commentReplyId, dto);
    }

    @Put('posts/:postId/like')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async toggleLike(@AuthUser() user: IUserProfileDTO, @Param('postId') postId: string) {
        return this.shareUpdaterService.toggleLike(user.id, postId);
    }

    /**
     *
     *  Delete
     *
     */
    @Delete('posts/:postId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async deletePost(@AuthUser() user: IUserProfileDTO, @Param('postId') postId: string) {
        return this.shareDeleterService.deletePost(user.id, postId);
    }

    @Delete('comments/:commentId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async deleteComment(@AuthUser() user: IUserProfileDTO, @Param('commentId') commentId: string) {
        return this.shareDeleterService.deleteComment(user.id, commentId);
    }

    @Delete('comment-replies/:commentReplyId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async deleteCommentReply(@AuthUser() user: IUserProfileDTO, @Param('commentReplyId') commentReplyId: string) {
        return this.shareDeleterService.deleteCommentReply(user.id, commentReplyId);
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
        pageParam = isNaN(Number(pageParam)) ? 0 : Number(pageParam);
        return this.shareSearcherService.getPostsInfiniteScroll(user?.id, pageParam, 10);
    }

    @Get('posts/:postId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtOptionalAuthGuard)
    async getPost(@AuthUser() user: IUserProfileDTO, @Param('postId') postId: string) {
        return this.shareSearcherService.getPost(user?.id, postId);
    }

    @Get('posts/list/users/:nickname')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtOptionalAuthGuard)
    async getUserPostsInfiniteScroll(
        @AuthUser() user: IUserProfileDTO,
        @Param('nickname') targetNickname: string,
        @Query('pageParam') pageParam: number,
    ) {
        pageParam = isNaN(Number(pageParam)) ? 0 : Number(pageParam);
        return this.shareSearcherService.getUserPostsInfiniteScroll(user?.id, targetNickname, pageParam, 12);
    }

    @Get('posts/:postId/comments/list')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtOptionalAuthGuard)
    async getCommentsInfiniteScroll(
        @AuthUser() user: IUserProfileDTO,
        @Param('postId') postId: string,
        @Query('pageParam') pageParam: number,
    ) {
        pageParam = isNaN(Number(pageParam)) ? 0 : Number(pageParam);
        return this.shareSearcherService.getCommentsInfiniteScroll(user?.id, postId, pageParam, 10);
    }

    @Get('comments/:id/replies/list')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtOptionalAuthGuard)
    async getCommentRepliesInfiniteScroll(
        @AuthUser() user: IUserProfileDTO,
        @Param('id') commentId: string,
        @Query('pageParam') pageParam: number,
    ) {
        pageParam = isNaN(Number(pageParam)) ? 0 : Number(pageParam);
        return this.shareSearcherService.getCommentRepliesInfiniteScroll(user?.id, commentId, pageParam, 10);
    }

    @Get('posts/:postId/like/list')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtOptionalAuthGuard)
    async getLikeListForPostInfiniteScroll(
        @AuthUser() user: IUserProfileDTO,
        @Param('postId') postId: string,
        @Query('pageParam') pageParam: number,
    ) {
        pageParam = isNaN(Number(pageParam)) ? 0 : Number(pageParam);
        return this.shareSearcherService.getLikeListForPostInfiniteScroll(user?.id, postId, pageParam, 10);
    }

    @Get('posts/list/me')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async getMyPostsInfiniteScroll(@AuthUser() user: IUserProfileDTO, @Query('pageParam') pageParam: number) {
        pageParam = isNaN(Number(pageParam)) ? 0 : Number(pageParam);
        return this.shareSearcherService.getMyPostsInfiniteScroll(user.id, pageParam, 12);
    }
}
