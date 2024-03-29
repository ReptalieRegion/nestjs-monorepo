import { Body, Controller, HttpCode, HttpStatus, Inject, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { ValidationPipe } from '../../global/error/validator/validator.pipe';
import { AdminProfile } from '../../types/guards/admin.types';
import { AuthService, AuthServiceToken } from './auth.service';
import { OtpDTO } from './dto/otp.dto';
import { RegisterDTO } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ModifyCookieInterceptor } from './interceptors/modify-cookie.interceptor';

@Controller('/auth')
export class AuthController {
    constructor(
        @Inject(AuthServiceToken)
        private readonly authService: AuthService,
    ) {}

    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    @Post('generate-otp')
    async login(@Req() req: { user: AdminProfile }) {
        await this.authService.generateAndSendOTP(req.user);
        return { message: 'success' };
    }

    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(ModifyCookieInterceptor)
    @Post('verify-otp-and-issue-token')
    async otp(@Body() body: OtpDTO) {
        return this.authService.verifyOTPAndIssueToken(body);
    }

    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(ModifyCookieInterceptor)
    @Post('register')
    async register(@Body(new ValidationPipe(-8501)) body: RegisterDTO) {
        return this.authService.register(body);
    }

    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(ModifyCookieInterceptor)
    @Post('refresh')
    async refreshToken(@Req() req: Request) {
        const refreshToken = req.cookies?.['refresh_token'] ?? '';
        const payload = await this.authService.verifyToken(refreshToken);
        return await this.authService.refreshToken(payload.sub, refreshToken);
    }
}
