import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { parsePaginationParams } from '../../utils/pagination';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService, UserServiceToken } from './user.service';

@Controller('user')
export class UserController {
    constructor(@Inject(UserServiceToken) private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get('list')
    async getUserList(@Query('pageParam') pageParam: string, @Query('limit') limit: string) {
        const { pageNumber, pageSize } = parsePaginationParams(pageParam ?? 0, limit ?? 10);
        const userInfos = await this.userService.findUsersInfo(pageNumber, pageSize);
        return userInfos;
    }

    @UseGuards(JwtAuthGuard)
    @Get('total-count')
    async getUserTotalCount() {
        const count = await this.userService.findUserTotalCount();
        return {
            users: {
                count,
            },
        };
    }
}
