import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { UserActivityType } from '@private-crawl/types';
import mongoose, { ClientSession } from 'mongoose';
import { InputDiaryCalendarDTO } from '../../../dto/diary/calendar/input-diaryCalendar.dto';
import { InputDiaryEntityDTO } from '../../../dto/diary/entity/input-diaryEntity.dto';
import { InputDiaryWeightDTO } from '../../../dto/diary/weight/input-diaryWeight.dto';
import { ImageType } from '../../../dto/image/input-image.dto';
import { IUserProfileDTO } from '../../../dto/user/user/user-profile.dto';
import { CustomException } from '../../../utils/error/customException';
import { CustomExceptionHandler } from '../../../utils/error/customException.handler';
import { ImageS3HandlerService, ImageS3HandlerServiceToken } from '../../image/service/imageS3Handler.service';
import { ImageWriterService, ImageWriterServiceToken } from '../../image/service/imageWriter.service';
import { NotificationSlackService, NotificationSlackServiceToken } from '../../notification/service/notificationSlack.service';
import { UserActivityLogService, UserActivityLogServiceToken } from '../../user-activity-log/userActivityLog.service';
import { DiaryCalendarRepository } from '../repository/diaryCalendar.repository';
import { DiaryEntityRepository } from '../repository/diaryEntity.repository';
import { DiaryWeightRepository } from '../repository/diaryWeight.repository';
import { DiaryUpdaterService, DiaryUpdaterServiceToken } from './diaryUpdater.service';

export const DiaryWriterServiceToken = 'DiaryWriterServiceToken';

@Injectable()
export class DiaryWriterService {
    constructor(
        @InjectConnection()
        private readonly connection: mongoose.Connection,

        private readonly diaryEntityRepository: DiaryEntityRepository,
        private readonly diaryWeightRepository: DiaryWeightRepository,
        private readonly diaryCalendarRepository: DiaryCalendarRepository,

        @Inject(ImageS3HandlerServiceToken)
        private readonly imageS3HandlerService: ImageS3HandlerService,
        @Inject(ImageWriterServiceToken)
        private readonly imageWriterService: ImageWriterService,

        @Inject(DiaryUpdaterServiceToken)
        private readonly diaryUpdaterService: DiaryUpdaterService,
        @Inject(NotificationSlackServiceToken)
        private readonly notificationSlackService: NotificationSlackService,

        @Inject(UserActivityLogServiceToken)
        private readonly userActivityLogService: UserActivityLogService,
    ) {}

    /**
     * 새로운 엔터티를 생성하고 연관된 이미지를 추가합니다.
     *
     * @param user - 엔터티를 생성하는 사용자.
     * @param files - 엔터티에 연결할 파일(이미지)의 배열.
     * @param dto - 엔터티를 생성하는 데 사용되는 입력 DTO.
     * @returns 생성된 엔터티를 반환합니다.
     */
    async createEntity(user: IUserProfileDTO, files: Express.Multer.File[], dto: InputDiaryEntityDTO) {
        const session: ClientSession = await this.connection.startSession();
        session.startTransaction();

        let imageKeys: string[] = [];

        try {
            const entity = await this.diaryEntityRepository.createEntity(
                {
                    ...dto,
                    userId: user.id,
                    imageId: String(new mongoose.Types.ObjectId()),
                },
                session,
            );

            if (!entity) {
                throw new CustomException('Failed to save diary entity.', HttpStatus.INTERNAL_SERVER_ERROR, -3601);
            }

            imageKeys = await this.imageS3HandlerService.uploadToS3(files);
            const [image] = await this.imageWriterService.createImage(entity.id as string, imageKeys, ImageType.Diary, session);
            await this.diaryUpdaterService.updateImageId(entity.id as string, image.id as string, session);

            this.userActivityLogService.createActivityLog({ userId: user.id, activityType: UserActivityType.ENTITY_CREATED });
            await session.commitTransaction();

            return entity;
        } catch (error) {
            const caughtError = error as Error;
            this.notificationSlackService.send(`*[푸시 알림]* 개체 생성 실패\n${caughtError.message}`, '푸시알림-에러-dev');

            await this.imageS3HandlerService.deleteImagesFromS3(imageKeys);
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
    }

    async createWeight(user: IUserProfileDTO, entityId: string, dto: InputDiaryWeightDTO) {
        try {
            const isExistsEntity = await this.diaryEntityRepository
                .findOne({ _id: entityId, userId: user.id, isDeleted: false })
                .exec();

            if (!isExistsEntity) {
                throw new CustomException('Not found for the specified diary entity.', HttpStatus.NOT_FOUND, -3301);
            }

            try {
                const weight = await this.diaryWeightRepository.createWeight({ ...dto, entityId });

                if (!weight) {
                    throw new CustomException('Failed to save diary weight.', HttpStatus.INTERNAL_SERVER_ERROR, -3602);
                }
            } catch (error) {
                throw new CustomException('diaryId and date should be unique values.', HttpStatus.EXPECTATION_FAILED, -3401);
            }

            this.userActivityLogService.createActivityLog({
                userId: user.id,
                activityType: UserActivityType.ENTITY_WEIGHT_CREATED,
            });
            return { message: 'Success' };
        } catch (error) {
            throw new CustomExceptionHandler(error).handleException('Invalid ObjectId for diary entity Id.', -3507);
        }
    }

    async createCalendar(user: IUserProfileDTO, dto: InputDiaryCalendarDTO) {
        const isExistsEntity = await this.diaryEntityRepository
            .findOne({ _id: dto.entityId, userId: user.id, isDeleted: false })
            .exec();

        if (!isExistsEntity) {
            throw new CustomException('Not found for the specified diary entity.', HttpStatus.NOT_FOUND, -3301);
        }

        const calendar = await this.diaryCalendarRepository.createCalendar({ ...dto, userId: user.id });

        if (!calendar) {
            throw new CustomException('Failed to save diary calendar.', HttpStatus.INTERNAL_SERVER_ERROR, -3603);
        }

        this.userActivityLogService.createActivityLog({
            userId: user.id,
            activityType: UserActivityType.CALENDAR_CREATED,
        });
        return { message: 'Success' };
    }
}
