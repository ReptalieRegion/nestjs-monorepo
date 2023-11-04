import { Body, Controller, HttpCode, HttpStatus, Inject, Post, UseGuards, Headers, Delete } from '@nestjs/common';
import { EncryptedDataDTO } from '../../dto/user/social/encryptedData.dto';
import { JoinProgressDTO } from '../../dto/user/social/joinProgress.dto';
import { IResponseUserDTO } from '../../dto/user/user/response-user.dto';
import { controllerErrorHandler } from '../../utils/error/errorHandler';
import { AuthUser } from '../user/user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
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
    @UseGuards(JwtSocialAuthGuard)
    async updateJoinProgress(@Body() dto: JoinProgressDTO) {
        try {
            return this.authService.updateJoinProgress(dto);
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
    async signOut(@AuthUser() user: IResponseUserDTO) {
        try {
            await this.authService.signOut(user.id);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    /**
     *
     *  Get
     *
     */
}
