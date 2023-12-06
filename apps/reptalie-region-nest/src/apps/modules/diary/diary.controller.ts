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
import { IUpdateEntityDTO, InputDiaryEntityDTO } from '../../dto/diary/entity/input-diaryEntity.dto';
import { IDeleteWeightDTO, IUpdateWeightDTO, InputDiaryWeightDTO } from '../../dto/diary/weight/input-diaryWeight.dto';
import { IUserProfileDTO } from '../../dto/user/user/response-user.dto';
import { controllerErrorHandler } from '../../utils/error/errorHandler';
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
        @Body() dto: InputDiaryEntityDTO,
    ) {
        try {
            return this.diaryWriterService.createEntity(user, files, dto);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Post('entity/:entityId/weight')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    async createWeight(
        @AuthUser() user: IUserProfileDTO,
        @Param('entityId') entityId: string,
        @Body() dto: InputDiaryWeightDTO,
    ) {
        try {
            return this.diaryWriterService.createWeight(user, entityId, dto);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    /**
     *
     *  Put
     *
     */
    @Put('entity/:entityId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async updateEntity(@AuthUser() user: IUserProfileDTO, @Param('entityId') entityId: string, @Body() dto: IUpdateEntityDTO) {
        try {
            return this.diaryUpdaterService.updateEntity(user, entityId, dto);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Put('entity/weight/:weightId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async updateWeight(@Param('weightId') weightId: string, @Body() dto: IUpdateWeightDTO) {
        try {
            return this.diaryUpdaterService.updateWeight(weightId, dto);
        } catch (error) {
            controllerErrorHandler(error);
        }
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
        try {
            return this.diaryDeleterService.deleteEntity(user, entityId);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }

    @Delete('entity/:entityId/weight')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async deleteWeight(@Param('entityId') entityId: string, @Body() dto: IDeleteWeightDTO) {
        try {
            return this.diaryDeleterService.deleteWeight(entityId, dto);
        } catch (error) {
            controllerErrorHandler(error);
        }
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
        try {
            return this.diarySearcherService.getEntityInfiniteScroll(user.id, pageParam, 10);
        } catch (error) {
            controllerErrorHandler(error);
        }
    }
}
