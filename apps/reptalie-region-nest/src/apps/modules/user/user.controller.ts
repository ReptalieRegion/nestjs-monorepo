import { Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Put, Query, UseGuards } from '@nestjs/common';

import { IResponseUserDTO } from '../../dto/user/response-user.dto';
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

    @Get('email-exists')
    async getEmailDuplicateCheck(@Query('email') email: string) {
        return await this.userSearcherService.isExistsEmail(email);
    }

    @Get('nickname-exists')
    async getNicknameDuplicateCheck(@Query('nickname') nickname: string) {
        return await this.userSearcherService.isExistsNickname(nickname);
    }

    @Post(':id/follow')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async createFollow(@AuthUser() user: IResponseUserDTO, @Param('id') follower: string) {
        try {
            return this.userWriterService.createFollow(user.id, follower);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Put(':id/follow')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async toggleFollow(@AuthUser() user: IResponseUserDTO, @Param('id') follower: string) {
        try {
            return this.userUpdaterService.toggleFollow(user.id, follower);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Get('profile')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtOptionalAuthGuard)
    async getUserProfile(@AuthUser() user: IResponseUserDTO, @Query('nickname') nickname: string) {
        try {
            return this.userSearcherService.getProfile(user?.id, nickname);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Get('follower/list')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async getUserFollowersInfiniteScroll(
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
}
