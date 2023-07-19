import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { IResponseUserDTO } from '../../dto/user/response-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './service/user.service';
import { AuthUser } from './user.decorator';

@Controller('/users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('email-exists')
    async getEmailDuplicateCheck(@Query('email') email: string) {
        return await this.userService.isExistsEmail(email);
    }

    @Get('nickname-exists')
    async getNicknameDuplicateCheck(@Query('nickname') nickname: string) {
        return await this.userService.isExistsNickname(nickname);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@AuthUser() user: IResponseUserDTO) {
        return user;
    }
}
