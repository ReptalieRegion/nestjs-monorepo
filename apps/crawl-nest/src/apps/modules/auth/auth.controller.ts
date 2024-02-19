import { Body, Controller, Delete, Get, Headers, HttpCode, HttpStatus, Inject, Post, UseGuards } from '@nestjs/common';
import { IEncryptedDataDTO, IJoinProgressDTO } from '../../dto/user/social/input-social.dto';
import { IRestoreRequestDTO } from '../../dto/user/tempUser/input-tempUser.dto';
import { IUserProfileDTO } from '../../dto/user/user/user-profile.dto';
import { ValidationPipe } from '../../utils/error/validator/validator.pipe';
import { AuthUser } from '../user/user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtSocialAuthGuard } from './guards/jwtSocial-auth.guard';
import { AuthCommonService, AuthCommonServiceToken } from './service/authCommon.service';
import { AuthSocialService, AuthSocialServiceToken } from './service/authSocial.service';
import { AuthTokenService, AuthTokenServiceToken } from './service/authToken.service';

@Controller('/auth')
export class AuthController {
    constructor(
        @Inject(AuthTokenServiceToken)
        private readonly authTokenService: AuthTokenService,
        @Inject(AuthCommonServiceToken)
        private readonly authCommonService: AuthCommonService,
        @Inject(AuthSocialServiceToken)
        private readonly authSocialService: AuthSocialService,
    ) {}

    /**
     *
     *  Post
     *
     */
    @Post('social/token')
    @HttpCode(HttpStatus.OK)
    async authToken() {
        return this.authTokenService.getAuthTokenAndPublicKey();
    }

    @Post('social/kakao')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtSocialAuthGuard)
    async socialKakao(@Body() dto: IEncryptedDataDTO) {
        return this.authSocialService.kakaoSignIn(dto);
    }

    @Post('social/apple')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtSocialAuthGuard)
    async socialApple(@Body() dto: IEncryptedDataDTO) {
        return this.authSocialService.appleSignIn(dto);
    }

    @Post('social/google')
    @HttpCode(HttpStatus.CREATED)
    async socialGoogle(@Headers('authorization') authorizationHeader: string) {
        const idToken = authorizationHeader?.split('Bearer ')[1];
        return this.authSocialService.googleSignIn(idToken);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async verifyRefreshToken(@Headers('authorization') authorizationHeader: string) {
        const refreshToken = authorizationHeader?.split('Bearer ')[1];
        return this.authCommonService.verifyRefreshToken(refreshToken);
    }

    @Post('social/join-progress')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtSocialAuthGuard)
    async handleJoinProgress(@Body(new ValidationPipe(-1504)) dto: IJoinProgressDTO) {
        return this.authCommonService.handleJoinProgress(dto);
    }

    @Post('restore')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtSocialAuthGuard)
    async restoreRequest(@Body() dto: IRestoreRequestDTO) {
        return this.authSocialService.restoreRequest(dto);
    }

    /**
     *
     *  Put
     *
     */

    /**
     *
     *  Delete
     *
     */
    @Delete('sign-out')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async signOut(@AuthUser() user: IUserProfileDTO) {
        return this.authCommonService.signOut(user.id);
    }

    @Delete('withdrawal')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async withdrawalRequest(@AuthUser() user: IUserProfileDTO) {
        return this.authSocialService.withdrawalRequest(user.id);
    }

    /**
     *
     *  Get
     *
     */
    @Get('sign-in/check')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async signInCheck() {
        return { message: 'success' };
    }
}
