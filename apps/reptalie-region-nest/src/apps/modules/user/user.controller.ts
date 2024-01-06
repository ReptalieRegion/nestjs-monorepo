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
import { ValidationPipe } from '../../utils/error/validator/validator.pipe';
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
    @Post(':userId/follow')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    async createFollow(@AuthUser() user: IUserProfileDTO, @Param('userId') follower: string) {
        return this.userWriterService.createFollow(user, follower);
    }

    /**
     *
     *  Put
     *
     */
    @Put(':userId/follow')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async toggleFollow(@AuthUser() user: IUserProfileDTO, @Param('userId') follower: string) {
        return this.userUpdaterService.toggleFollow(user.id, follower);
    }

    @Put('me/profile-image')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('files'))
    async updateMyProfile(@AuthUser() user: IUserProfileDTO, @UploadedFiles() files: Express.Multer.File[]) {
        return this.userUpdaterService.updateMyProfileImage(user, files);
    }

    @Put('fcm-token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async updateFcmToken(@AuthUser() user: IUserProfileDTO, @Body(new ValidationPipe(-1503)) dto: fcmTokenDTO) {
        return this.userUpdaterService.updateFcmToken(user, dto);
    }

    /**
     *
     *  Delete
     *
     */
    @Delete('fcm-token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async deleteFcmToken(@AuthUser() user: IUserProfileDTO) {
        return this.userDeleterService.fcmTokenDelete(user.id);
    }

    @Delete('withdrawal-request')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async deleteUser(@AuthUser() user: IUserProfileDTO) {
        return this.userDeleterService.deleteUser(user.id);
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
        return this.userSearcherService.getProfile(nickname, user);
    }

    @Get('me/profile')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async getMyProfile(@AuthUser() user: IUserProfileDTO) {
        return this.userSearcherService.getMyProfile(user);
    }

    @Get('follower/list')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async getFollowersInfiniteScroll(
        @AuthUser() user: IUserProfileDTO,
        @Query('search') search: string,
        @Query('pageParam') pageParam: number,
    ) {
        pageParam = isNaN(Number(pageParam)) ? 0 : Number(pageParam);
        return this.userSearcherService.getFollowersInfiniteScroll(user.id, search, pageParam, 10);
    }

    @Get(':userId/follower/list')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtOptionalAuthGuard)
    async getUserFollowersInfiniteScroll(
        @AuthUser() user: IUserProfileDTO,
        @Param('userId') targetUserId: string,
        @Query('pageParam') pageParam: number,
    ) {
        pageParam = isNaN(Number(pageParam)) ? 0 : Number(pageParam);
        return this.userSearcherService.getUserFollowersInfiniteScroll(user?.id, targetUserId, pageParam, 10);
    }

    @Get(':userId/following/list')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtOptionalAuthGuard)
    async getUserFollowingsInfiniteScroll(
        @AuthUser() user: IUserProfileDTO,
        @Param('userId') targetUserId: string,
        @Query('pageParam') pageParam: number,
    ) {
        pageParam = isNaN(Number(pageParam)) ? 0 : Number(pageParam);
        return this.userSearcherService.getUserFollowingsInfiniteScroll(user?.id, targetUserId, pageParam, 10);
    }

    @Get('duplicate/nickname/:nickname')
    @HttpCode(HttpStatus.OK)
    async duplicateNickname(@Param('nickname') nickname: string) {
        return this.userSearcherService.isDuplicateNickname(nickname);
    }
}
