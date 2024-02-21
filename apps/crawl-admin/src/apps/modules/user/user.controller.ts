import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { parsePaginationParams } from '../../utils/pagination';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService, UserServiceToken } from './user.service';

@Controller('user')
export class UserController {
    constructor(@Inject(UserServiceToken) private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get('list')
    async getUserList(@Query('pageParam') pageParam: string, @Query('limitSize') limitSize: string) {
        const { pageNumber, pageSize } = parsePaginationParams(pageParam ?? 0, limitSize ?? 10);
        const userInfos = await this.userService.findUsersInfo(pageNumber, pageSize);

        return {
            items: userInfos,
            nextPage: userInfos.length < pageSize ? undefined : pageNumber + 1,
        };
    }
}
