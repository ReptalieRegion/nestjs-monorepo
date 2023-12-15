import { Body, Controller, HttpCode, HttpStatus, Inject, Post, UseGuards } from '@nestjs/common';
import { InputReportDTO } from '../../dto/report/input-report.dto';
import { IUserProfileDTO } from '../../dto/user/user/response-user.dto';
import { controllerErrorHandler } from '../../utils/error/errorHandler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUser } from '../user/user.decorator';
import { ReportSearcherService, ReportSearcherServiceToken } from './service/reportSearcher.service';
import { ReportWriterService, ReportWriterServiceToken } from './service/reportWriter.service';

@Controller('report')
export class ReportController {
    constructor(
        @Inject(ReportWriterServiceToken)
        private readonly reportWriterService: ReportWriterService,
        @Inject(ReportSearcherServiceToken)
        private readonly reportSearcherService: ReportSearcherService,
    ) {}

    /**
     *
     *  Post
     *
     */
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    async createPostWithImages(@AuthUser() user: IUserProfileDTO, @Body() dto: InputReportDTO) {
        try {
            return this.reportWriterService.createReport(user.id, dto);
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

    /**
     *
     *  Get
     *
     */
}
