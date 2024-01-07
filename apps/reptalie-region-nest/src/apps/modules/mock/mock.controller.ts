import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
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
        return this.mockService.createUser(body.nickname);
    }

    @Post('users')
    @HttpCode(HttpStatus.CREATED)
    async createUsers(@Body() body: { size?: string }) {
        return this.mockService.createUsers(Number(body.size ?? '1'));
    }

    @Post('share-posts')
    @HttpCode(HttpStatus.CREATED)
    async createPosts(@Body() body: { size?: string; nickname?: string }) {
        return this.mockService.createPosts(Number(body.size ?? '1'), body.nickname);
    }

    @Post('share-post')
    @HttpCode(HttpStatus.CREATED)
    async createPost(@Body() body: { nickname: string }) {
        return this.mockService.createPost(body.nickname);
    }

    @Post('share-post/comments')
    @HttpCode(HttpStatus.CREATED)
    async createComments(@Body() body: { size?: string; postId?: string }) {
        return this.mockService.createComments(Number(body.size ?? '1'), body.postId);
    }

    @Post('share-post/comment-replies')
    @HttpCode(HttpStatus.CREATED)
    async createCommentReplies(@Body() body: { size?: string; commentId?: string }) {
        return this.mockService.createCommentReplies(Number(body.size ?? '1'), body.commentId);
    }

    @Post('share-post/follow')
    @HttpCode(HttpStatus.CREATED)
    async createCommentFollow(@Body() body: { size?: string; nickname?: string }) {
        return this.mockService.createCommentFollow(Number(body.size ?? '1'), body.nickname);
    }

    @Post('share-post/like')
    @HttpCode(HttpStatus.CREATED)
    async createCommentLike(@Body() body: { size?: string; postId?: string }) {
        return this.mockService.createPostLike(Number(body.size ?? '1'), body.postId);
    }

    @Post('diary/entity')
    @HttpCode(HttpStatus.CREATED)
    async createEntity(@Body() body: { size?: string; nickname?: string }) {
        return this.mockService.createDiaryEntity(Number(body.size ?? '1'), body.nickname);
    }
}
