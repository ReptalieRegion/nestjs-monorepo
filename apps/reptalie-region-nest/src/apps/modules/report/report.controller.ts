import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Post, Query, UseGuards } from '@nestjs/common';
import { InputReportShareContentDTO } from '../../dto/report/share/input-reportShareContent.dto';
import { IUserProfileDTO } from '../../dto/user/user/response-user.dto';
import { ValidationPipe } from '../../utils/error/validator/validator.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUser } from '../user/user.decorator';
import { ReportDeleterService, ReportDeleterServiceToken } from './service/reportDeleter.service';
import { ReportSearcherService, ReportSearcherServiceToken } from './service/reportSearcher.service';
import { ReportWriterService, ReportWriterServiceToken } from './service/reportWriter.service';

@Controller('report')
export class ReportController {
    constructor(
        @Inject(ReportWriterServiceToken)
        private readonly reportWriterService: ReportWriterService,
        @Inject(ReportSearcherServiceToken)
        private readonly reportSearcherService: ReportSearcherService,
        @Inject(ReportDeleterServiceToken)
        private readonly reportDeleterService: ReportDeleterService,
    ) {}

    /**
     *
     *  Post
     *
     */
    @Post('share-content')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    async createReportShareContent(
        @AuthUser() user: IUserProfileDTO,
        @Body(new ValidationPipe(-6501)) dto: InputReportShareContentDTO,
    ) {
        return this.reportWriterService.createReportShareContent(user.id, dto);
    }

    @Post('users/:nickname/blocking')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    async createReportUserBlocking(@AuthUser() user: IUserProfileDTO, @Param('nickname') nickname: string) {
        return this.reportWriterService.createReportUserBlocking(user.id, nickname);
    }

    /**
     *
     *  Delete
     *
     */
    @Delete('user-blocking/:blockingId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async deleteReportUserBlocking(@AuthUser() user: IUserProfileDTO, @Param('blockingId') blockingId: string) {
        return this.reportDeleterService.deleteReportUserBlocking(user.id, blockingId);
    }

    /**
     *
     *  Get
     *
     */
    @Get('user-blocking/list')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async getUserBlockingInfiniteScroll(@AuthUser() user: IUserProfileDTO, @Query('pageParam') pageParam: number) {
        pageParam = isNaN(Number(pageParam)) ? 0 : Number(pageParam);
        return this.reportSearcherService.getUserBlockingInfiniteScroll(user.id, pageParam, 10);
    }
}
