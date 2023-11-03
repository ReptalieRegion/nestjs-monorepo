import { Body, Controller, HttpCode, HttpStatus, Inject, Post, UseGuards, Headers, Delete } from '@nestjs/common';
import { EncryptedDataDTO } from '../../dto/user/social/encryptedData.dto';
import { controllerErrorHandler } from '../../utils/error/errorHandler';
import { JwtSocialAuthGuard } from './guards/jwtSocial-auth.guard';
import { AppleService, AppleServiceToken } from './service/apple.service';
import { AuthService, AuthServiceToken } from './service/auth.service';
import { GoogleService, GoogleServiceToken } from './service/google.service';
import { KakaoService, KakaoServiceToken } from './service/kakao.service';

@Controller('/auth')
export class AuthController {
    constructor(
        @Inject(AuthServiceToken)
        private readonly authService: AuthService,
        @Inject(KakaoServiceToken)
        private readonly kakaoService: KakaoService,
        @Inject(GoogleServiceToken)
        private readonly googleService: GoogleService,
        @Inject(AppleServiceToken)
        private readonly appleService: AppleService,
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
            return this.authService.getAuthTokenAndPublicKey();
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Post('social/kakao')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtSocialAuthGuard)
    async socialKakao(@Body() dto: EncryptedDataDTO) {
        try {
            return this.kakaoService.kakaoSignIn(dto);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async verifyRefreshToken(@Headers('authorization') authorizationHeader: string) {
        try {
            const refreshToken = authorizationHeader.split('Bearer ')[1];

            return this.authService.verifyRefreshToken(refreshToken);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Post('social/join-progress')
    @HttpCode(HttpStatus.OK)
    async updateJoinProgress() {}

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
    @Delete('logout')
    @HttpCode(HttpStatus.OK)
    async logout() {}

    /**
     *
     *  Get
     *
     */
}
