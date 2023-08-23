import { Body, Controller, HttpCode, HttpStatus, UseGuards, Post, UseInterceptors } from '@nestjs/common';

import { InputUserDTO } from '../../dto/user/input-user.dto';
import { IResponseUserDTO } from '../../dto/user/response-user.dto';
import { AuthUser } from '../user/user.decorator';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { TokenInterceptor } from './interceptors/token.interceptor';

@Controller('/auth')
@UseInterceptors(TokenInterceptor)
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('sign-up')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() createUserDTO: InputUserDTO) {
        return await this.authService.signUp(createUserDTO);
    }

    @Post('sign-in')
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    async signIn(@AuthUser() user: IResponseUserDTO) {
        return user;
    }
}
