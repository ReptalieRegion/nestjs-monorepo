import { Body, Controller, Delete, Get, Headers, HttpCode, HttpStatus, Inject, Post, UseGuards } from '@nestjs/common';
import { IEncryptedDataDTO, IJoinProgressDTO } from '../../dto/user/social/input-social.dto';
import { IUserProfileDTO } from '../../dto/user/user/response-user.dto';
import { controllerErrorHandler } from '../../utils/error/errorHandler';
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
        try {
            return this.authTokenService.getAuthTokenAndPublicKey();
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Post('social/kakao')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtSocialAuthGuard)
    async socialKakao(@Body() dto: IEncryptedDataDTO) {
        try {
            return this.authSocialService.kakaoSignIn(dto);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Post('social/apple')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtSocialAuthGuard)
    async socialApple(@Body() dto: IEncryptedDataDTO) {
        try {
            return this.authSocialService.appleSignIn(dto);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Post('social/google')
    @HttpCode(HttpStatus.CREATED)
    async socialGoogle(@Headers('authorization') authorizationHeader: string) {
        try {
            const idToken = authorizationHeader.split('Bearer ')[1];

            return this.authSocialService.googleSignIn(idToken);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async verifyRefreshToken(@Headers('authorization') authorizationHeader: string) {
        try {
            const refreshToken = authorizationHeader.split('Bearer ')[1];

            return this.authCommonService.verifyRefreshToken(refreshToken);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Post('social/join-progress')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtSocialAuthGuard)
    async handleJoinProgress(@Body() dto: IJoinProgressDTO) {
        try {
            return this.authCommonService.handleJoinProgress(dto);
        } catch (error) {
            controllerErrorHandler(error);
        }
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
        try {
            return this.authCommonService.signOut(user.id);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    /**
     *
     *  Get
     *
     */
    @Get('sign-in/check')
    @UseGuards(JwtSocialAuthGuard)
    async signInCheck() {
        return { message: 'success' };
    }
}
