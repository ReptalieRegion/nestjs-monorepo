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
import { fcmTokenDTO } from '../../dto/user/user/fcm-token.dto';
import { IUserProfileDTO } from '../../dto/user/user/response-user.dto';
import { controllerErrorHandler } from '../../utils/error/errorHandler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtOptionalAuthGuard } from '../auth/guards/jwtOptional-auth.guard';
import { UserDeleterService, UserDeleterServiceToken } from './service/userDeleter.service';
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
        @Inject(UserDeleterServiceToken)
        private readonly userDeleterService: UserDeleterService,
    ) {}

    /**
     *
     *  Post
     *
     */
    @Post(':id/follow')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    async createFollow(@AuthUser() user: IUserProfileDTO, @Param('id') follower: string) {
        try {
            return this.userWriterService.createFollow(user, follower);
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
    async toggleFollow(@AuthUser() user: IUserProfileDTO, @Param('id') follower: string) {
        try {
            return this.userUpdaterService.toggleFollow(user?.id, follower);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Put('me/profile-image')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('files'))
    async updateMyProfile(@AuthUser() user: IUserProfileDTO, @UploadedFiles() files: Express.Multer.File[]) {
        try {
            return this.userUpdaterService.updateMyProfileImage(user, files);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Put('fcm-token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async updateFcmToken(@AuthUser() user: IUserProfileDTO, @Body() dto: fcmTokenDTO) {
        try {
            return this.userUpdaterService.updateFcmToken(user, dto);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    /**
     *
     *  Delete
     *
     */
    @Delete('fcm-token')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard)
    async deleteFcmToken(@AuthUser() user: IUserProfileDTO) {
        try {
            this.userDeleterService.fcmTokenDelete(user?.id);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    /**
     *
     *  Get
     *
     */
    @Get('profile')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtOptionalAuthGuard)
    async getUserProfile(@AuthUser() user: IUserProfileDTO, @Query('nickname') nickname: string) {
        try {
            return this.userSearcherService.getProfile(nickname, user);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Get('me/profile')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async getMyProfile(@AuthUser() user: IUserProfileDTO) {
        try {
            return this.userSearcherService.getMyProfile(user);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Get('follower/list')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async getFollowersInfiniteScroll(
        @AuthUser() user: IUserProfileDTO,
        @Query('search') search: string,
        @Query('pageParam') pageParam: number,
    ) {
        try {
            return this.userSearcherService.getFollowersInfiniteScroll(user?.id, search, pageParam, 10);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Get(':id/follower/list')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtOptionalAuthGuard)
    async getUserFollowersInfiniteScroll(
        @AuthUser() user: IUserProfileDTO,
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
        @AuthUser() user: IUserProfileDTO,
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
