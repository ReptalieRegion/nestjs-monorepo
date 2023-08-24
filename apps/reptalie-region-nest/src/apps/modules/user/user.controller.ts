import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';

import { IResponseUserDTO } from '../../dto/user/response-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserSearcherService, UserSearcherServiceToken } from './service/userSearcher.service';
import { AuthUser } from './user.decorator';

@Controller('/users')
export class UserController {
    constructor(
        @Inject(UserSearcherServiceToken)
        private readonly userSearcherService: UserSearcherService,
    ) {}

    @Get('email-exists')
    async getEmailDuplicateCheck(@Query('email') email: string) {
        return await this.userSearcherService.isExistsEmail(email);
    }

    @Get('nickname-exists')
    async getNicknameDuplicateCheck(@Query('nickname') nickname: string) {
        return await this.userSearcherService.isExistsNickname(nickname);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@AuthUser() user: IResponseUserDTO) {
        return user;
    }
}
