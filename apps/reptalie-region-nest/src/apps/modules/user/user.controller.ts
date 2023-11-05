import { Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Put, Query, UseGuards } from '@nestjs/common';

import { IResponseUserDTO } from '../../dto/user/user/response-user.dto';
import { controllerErrorHandler } from '../../utils/error/errorHandler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtOptionalAuthGuard } from '../auth/guards/jwtOptional-auth.guard';
import { UserSearcherService, UserSearcherServiceToken } from './service/userSearcher.service';
import { UserUpdaterService, UserUpdaterServiceToken } from './service/userUpdater.service';
import { UserWriterService, UserWriterServiceToken } from './service/userWriter.service';
import { AuthUser } from './user.decorator';

@Controller('/users')
export class UserController {
    constructor(
        @Inject(UserSearcherServiceToken)
        private readonly userSearcherService: UserSearcherService,
        @Inject(UserWriterServiceToken)
        private readonly userWriterService: UserWriterService,
        @Inject(UserUpdaterServiceToken)
        private readonly userUpdaterService: UserUpdaterService,
    ) {}

    /**
     *
     *  Post
     *
     */

    @Post(':id/follow')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    async createFollow(@AuthUser() user: IResponseUserDTO, @Param('id') follower: string) {
        try {
            return this.userWriterService.createFollow(user.id, follower);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    /**
     *
     *  Put
     *
     */
    @Put(':id/follow')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async toggleFollow(@AuthUser() user: IResponseUserDTO, @Param('id') follower: string) {
        try {
            return this.userUpdaterService.toggleFollow(user.id, follower);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    /**
     *
     *  Delete
     *
     */

    /**
     *
     *  Get
     *
     */
    @Get('profile')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtOptionalAuthGuard)
    async getUserProfile(@AuthUser() user: IResponseUserDTO, @Query('nickname') nickname: string) {
        try {
            return this.userSearcherService.getProfile(nickname, user);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Get('me/profile')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async getMyProfile(@AuthUser() user: IResponseUserDTO) {
        return user;
    }

    @Get('follower/list')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async getFollowersInfiniteScroll(
        @AuthUser() user: IResponseUserDTO,
        @Query('search') search: string,
        @Query('pageParam') pageParam: number,
    ) {
        try {
            return this.userSearcherService.getFollowersInfiniteScroll(user.id, search, pageParam, 10);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Get(':id/follower/list')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtOptionalAuthGuard)
    async getUserFollowersInfiniteScroll(
        @AuthUser() user: IResponseUserDTO,
        @Param('id') targetUserId: string,
        @Query('pageParam') pageParam: number,
    ) {
        try {
            return this.userSearcherService.getUserFollowersInfiniteScroll(user?.id, targetUserId, pageParam, 10);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Get(':id/following/list')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtOptionalAuthGuard)
    async getUserFollowingsInfiniteScroll(
        @AuthUser() user: IResponseUserDTO,
        @Param('id') targetUserId: string,
        @Query('pageParam') pageParam: number,
    ) {
        try {
            return this.userSearcherService.getUserFollowingsInfiniteScroll(user?.id, targetUserId, pageParam, 10);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Get('duplicate/nickname/:nickname')
    @HttpCode(HttpStatus.OK)
    async duplicateNickname(@Param('nickname') nickname: string) {
        try {
            return this.userSearcherService.isDuplicateNickname(nickname);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }
}
