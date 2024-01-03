import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Param,
    Post,
    Put,
    Query,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { IUpdateCalendarDTO, InputDiaryCalendarDTO } from '../../dto/diary/calendar/input-diaryCalendar.dto';
import { IUpdateEntityDTO, InputDiaryEntityDTO } from '../../dto/diary/entity/input-diaryEntity.dto';
import { IDeleteWeightDTO, IUpdateWeightDTO, InputDiaryWeightDTO } from '../../dto/diary/weight/input-diaryWeight.dto';
import { IUserProfileDTO } from '../../dto/user/user/response-user.dto';
import { ValidationPipe } from '../../utils/error/validator/validator.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUser } from '../user/user.decorator';
import { DiaryDeleterService, DiaryDeleterServiceToken } from './service/diaryDeleter.service';
import { DiarySearcherService, DiarySearcherServiceToken } from './service/diarySearcher.service';
import { DiaryUpdaterService, DiaryUpdaterServiceToken } from './service/diaryUpdater.service';
import { DiaryWriterService, DiaryWriterServiceToken } from './service/diaryWriter.service';

@Controller('diary')
export class DiaryController {
    constructor(
        @Inject(DiaryWriterServiceToken)
        private readonly diaryWriterService: DiaryWriterService,
        @Inject(DiaryUpdaterServiceToken)
        private readonly diaryUpdaterService: DiaryUpdaterService,
        @Inject(DiaryDeleterServiceToken)
        private readonly diaryDeleterService: DiaryDeleterService,
        @Inject(DiarySearcherServiceToken)
        private readonly diarySearcherService: DiarySearcherService,
    ) {}

    /**
     *
     *  Post
     *
     */
    @Post('entity')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('files'))
    async createEntity(
        @AuthUser() user: IUserProfileDTO,
        @UploadedFiles() files: Express.Multer.File[],
        @Body(new ValidationPipe(-1201)) dto: InputDiaryEntityDTO,
    ) {
        return this.diaryWriterService.createEntity(user, files, dto);
    }

    @Post('entity/:entityId/weight')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    async createWeight(
        @AuthUser() user: IUserProfileDTO,
        @Param('entityId') entityId: string,
        @Body(new ValidationPipe(-1201)) dto: InputDiaryWeightDTO,
    ) {
        return this.diaryWriterService.createWeight(user, entityId, dto);
    }

    @Post('calendar')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    async createCalendar(@AuthUser() user: IUserProfileDTO, @Body(new ValidationPipe(-1201)) dto: InputDiaryCalendarDTO) {
        return this.diaryWriterService.createCalendar(user, dto);
    }

    /**
     *
     *  Put
     *
     */
    @Put('entity/:entityId')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FilesInterceptor('files'))
    @UseGuards(JwtAuthGuard)
    async updateEntity(
        @AuthUser() user: IUserProfileDTO,
        @Param('entityId') entityId: string,
        @Body(new ValidationPipe(-1201)) dto: IUpdateEntityDTO,
        @UploadedFiles() files?: Express.Multer.File[],
    ) {
        return this.diaryUpdaterService.updateEntity(user, entityId, dto, files);
    }

    @Put('entity/:entityId/weight')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async updateWeight(@Param('entityId') entityId: string, @Body() dto: IUpdateWeightDTO) {
        return this.diaryUpdaterService.updateWeight(entityId, dto);
    }

    @Put('calendar/:calendarId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async updateCalendar(@Param('calendarId') calendarId: string, @Body() dto: IUpdateCalendarDTO) {
        return this.diaryUpdaterService.updateCalendar(calendarId, dto);
    }

    /**
     *
     *  Delete
     *
     */
    @Delete('entity/:entityId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async deleteEntity(@AuthUser() user: IUserProfileDTO, @Param('entityId') entityId: string) {
        return this.diaryDeleterService.deleteEntity(user, entityId);
    }

    @Delete('entity/:entityId/weight')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async deleteWeight(@Param('entityId') entityId: string, @Body() dto: IDeleteWeightDTO) {
        return this.diaryDeleterService.deleteWeight(entityId, dto);
    }

    @Delete('calendar/:calendarId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async deleteCalendar(@Param('calendarId') calendarId: string) {
        return this.diaryDeleterService.deleteCalendar(calendarId);
    }

    /**
     *
     *  Get
     *
     */
    @Get('entity/list')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async getEntityInfiniteScroll(@AuthUser() user: IUserProfileDTO, @Query('pageParam') pageParam: number) {
        return this.diarySearcherService.getEntityInfiniteScroll(user.id, pageParam, 10);
    }

    @Get('entity/:entityId/weight/list')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async getWeightInfiniteScroll(@Param('entityId') entityId: string, @Query('pageParam') pageParam: number) {
        return this.diarySearcherService.getWeightInfiniteScroll(entityId, pageParam, 7);
    }

    @Get('calendar/list')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async getCalendarInfiniteScroll(
        @AuthUser() user: IUserProfileDTO,
        @Query('startDate') startDate: Date,
        @Query('endDate') endDate: Date,
    ) {
        return this.diarySearcherService.getCalendarInfo(user.id, startDate, endDate);
    }
}
