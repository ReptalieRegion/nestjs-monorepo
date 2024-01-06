import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { controllerErrorHandler } from '../../../../dist/apps/utils/error/errorHandler';
import { MockService, MockServiceToken } from './mock.service';

@Controller('/mock')
export class MockController {
    constructor(
        @Inject(MockServiceToken)
        private readonly mockService: MockService,
    ) {}

    @Post('user')
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Body() body: { nickname?: string }) {
        try {
            return this.mockService.createUser(body.nickname);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Post('users')
    @HttpCode(HttpStatus.CREATED)
    async createUsers(@Body() body: { size?: string }) {
        try {
            return this.mockService.createUsers(Number(body.size ?? '1'));
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Post('share-post')
    @HttpCode(HttpStatus.CREATED)
    async createPost(@Body() body: { size?: string }) {
        try {
            return this.mockService.createPosts(Number(body.size ?? '1'));
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Post('share-post/comments')
    @HttpCode(HttpStatus.CREATED)
    async createComments(@Body() body: { size?: string; postId?: string }) {
        try {
            return this.mockService.createComments(Number(body.size ?? '1'), body.postId);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Post('share-post/comment-replies')
    @HttpCode(HttpStatus.CREATED)
    async createCommentReplies(@Body() body: { size?: string; commentId?: string }) {
        try {
            return this.mockService.createCommentReplies(Number(body.size ?? '1'), body.commentId);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Post('share-post/follow')
    @HttpCode(HttpStatus.CREATED)
    async createCommentFollow(@Body() body: { size?: string; nickname?: string }) {
        try {
            return this.mockService.createCommentFollow(Number(body.size ?? '1'), body.nickname);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Post('share-post/like')
    @HttpCode(HttpStatus.CREATED)
    async createCommentLike(@Body() body: { size?: string; postId?: string }) {
        try {
            return this.mockService.createPostLike(Number(body.size ?? '1'), body.postId);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Post('diary/entity')
    @HttpCode(HttpStatus.CREATED)
    async createEntity(@Body() body: { size?: string; nickname?: string }) {
        try {
            return this.mockService.createDiaryEntity(Number(body.size ?? '1'), body.nickname);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }
}
