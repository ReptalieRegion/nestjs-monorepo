import { Controller, Get, HttpStatus, Inject, Param, Post, Put, Query, UseGuards } from '@nestjs/common';

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
    async createFollow(@AuthUser() user: IResponseUserDTO, @Param('id') follower: string) {
        try {
            await this.userWriterService.createFollow(user.id, follower);
            return { statusCode: HttpStatus.CREATED, message: 'Follow created successfully' };
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Put(':id/follow')
    @UseGuards(JwtAuthGuard)
    async toggleFollow(@AuthUser() user: IResponseUserDTO, @Param('id') follower: string) {
        try {
            await this.userUpdaterService.toggleFollow(user.id, follower);
            return { statusCode: HttpStatus.OK, message: 'Follow toggled successfully' };
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Get('profile')
    @UseGuards(JwtOptionalAuthGuard)
    async getUserProfile(@AuthUser() user: IResponseUserDTO, @Query('nickname') nickname: string) {
        try {
            const profile = await this.userSearcherService.getUserProfile(user?.id, nickname);
            return { statusCode: HttpStatus.OK, response: profile };
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Get('follower/list')
    @UseGuards(JwtAuthGuard)
    async getUserFollowers(
        @AuthUser() user: IResponseUserDTO,
        @Query('search') search: string,
        @Query('pageParams') pageParams: number,
    ) {
        try {
            const followers = await this.userSearcherService.getUserFollowers(user.id, search, pageParams);
            return { statusCode: HttpStatus.OK, response: followers };
        } catch (error) {
            controllerErrorHandler(error);
        }
    }
}
