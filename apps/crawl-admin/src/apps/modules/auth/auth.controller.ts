import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { SlackService } from '@private-crawl/slack';
import { ValidationPipe } from '../../global/error/validator/validator.pipe';
import { AdminProfile } from '../../types/guards/admin.types';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ModifyCookieInterceptor } from './interceptors/modify-cookie.interceptor';

@Controller('/auth')
export class AuthController {
    constructor(private authService: AuthService, private slackService: SlackService) {}

    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(ModifyCookieInterceptor)
    @Post('login')
    async login(@Req() req: { user: AdminProfile }) {
        return this.authService.login(req.user);
    }

    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(ModifyCookieInterceptor)
    @Post('register')
    async register(@Body(new ValidationPipe(-8501)) body: RegisterDTO) {
        return this.authService.register(body);
    }

    @Post('slack')
    async test() {
        this.slackService.send('슬랙 보내기', '개발채널');
    }
}
