import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { SchemaId, UserActivityType } from '@private-crawl/types';
import mongoose, { ClientSession } from 'mongoose';
import { ImageType } from '../../../dto/image/input-image.dto';
import { IUserProfileDTO } from '../../../dto/user/user/user-profile.dto';
import { CustomException } from '../../../utils/error/customException';
import { CustomExceptionHandler } from '../../../utils/error/customException.handler';
import { ImageDeleterService, ImageDeleterServiceToken } from '../../image/service/imageDeleter.service';
import { NotificationSlackService, NotificationSlackServiceToken } from '../../notification/service/notificationSlack.service';
import { UserActivityLogService, UserActivityLogServiceToken } from '../../user-activity-log/userActivityLog.service';
import { DiaryCalendarRepository } from '../repository/diaryCalendar.repository';
import { DiaryEntityRepository } from '../repository/diaryEntity.repository';
import { DiaryWeightRepository } from '../repository/diaryWeight.repository';
import { DiarySearcherService, DiarySearcherServiceToken } from './diarySearcher.service';

export const DiaryDeleterServiceToken = 'DiaryDeleterServiceToken';

@Injectable()
export class DiaryDeleterService {
    constructor(
        @InjectConnection()
        private readonly connection: mongoose.Connection,

        private readonly diaryEntityRepository: DiaryEntityRepository,
        private readonly diaryWeightRepository: DiaryWeightRepository,
        private readonly diaryCalendarRepository: DiaryCalendarRepository,

        @Inject(ImageDeleterServiceToken)
        private readonly imageDeleterService: ImageDeleterService,
        @Inject(DiarySearcherServiceToken)
        private readonly diarySearcherService: DiarySearcherService,

        @Inject(UserActivityLogServiceToken)
        private readonly userActivityLogService: UserActivityLogService,

        @Inject(NotificationSlackServiceToken)
        private readonly notificationSlackService: NotificationSlackService,
    ) {}

    async deleteEntity(user: IUserProfileDTO, entityId: string) {
        const session: ClientSession = await this.connection.startSession();
        session.startTransaction();

        try {
            const entityResult = await this.diaryEntityRepository
                .updateOne({ userId: user.id, _id: entityId, isDeleted: false }, { $set: { isDeleted: true } }, { session })
                .exec();

            if (entityResult.modifiedCount === 0) {
                throw new CustomException('Failed to delete diary entity.', HttpStatus.INTERNAL_SERVER_ERROR, -3608);
            }

            await Promise.all([
                this.imageDeleterService.deleteImageByTypeId(ImageType.Diary, [entityId], session),
                this.diaryWeightRepository
                    .updateMany({ entityId, isDeleted: false }, { $set: { isDeleted: true } }, { session })
                    .exec(),
                this.diaryCalendarRepository
                    .updateMany({ entityId, userId: user.id, isDeleted: false }, { $set: { isDeleted: true } }, { session })
                    .exec(),
            ]);

            this.userActivityLogService.createActivityLog({
                userId: user.id,
                activityType: UserActivityType.ENTITY_DELETED,
            });

            await session.commitTransaction();

            return { message: 'Success' };
        } catch (error) {
            await session.abortTransaction();
            throw new CustomExceptionHandler(error).handleException('Invalid ObjectId for diary entity Id.', -3507);
        } finally {
            await session.endSession();
        }
    }

    async deleteWeight(weightId: string) {
        try {
            const result = await this.diaryWeightRepository
                .updateOne({ _id: weightId, isDeleted: false }, { $set: { isDeleted: true } })
                .exec();

            if (result.modifiedCount === 0) {
                throw new CustomException('Failed to delete diary entity weight.', HttpStatus.INTERNAL_SERVER_ERROR, -3609);
            }

            this.diaryWeightRepository
                .findById(weightId)
                .exec()
                .then(async (calendar) => {
                    if (!calendar) {
                        throw new Error('Not Fount Calendar');
                    }

                    const entity = await this.diaryEntityRepository.findById(calendar.entityId);

                    if (!entity) {
                        throw new Error('Not Fount Entity');
                    }

                    this.userActivityLogService.createActivityLog({
                        userId: entity.userId as unknown as SchemaId,
                        activityType: UserActivityType.ENTITY_WEIGHT_DELETED,
                    });
                })
                .catch(() => {
                    this.notificationSlackService.send('[Entity Weight Delete] 로그 남기기 실패');
                });

            return { message: 'Success' };
        } catch (error) {
            throw new CustomExceptionHandler(error).handleException('Invalid ObjectId for diary weightId.', -3509);
        }
    }

    async deleteCalendar(calendarId: string) {
        try {
            const result = await this.diaryCalendarRepository
                .updateOne({ _id: calendarId, isDeleted: false }, { $set: { isDeleted: true } })
                .exec();

            if (result.modifiedCount === 0) {
                throw new CustomException('Failed to delete diary entity calendar.', HttpStatus.INTERNAL_SERVER_ERROR, -3610);
            }

            this.diaryCalendarRepository
                .findById(calendarId)
                .exec()
                .then((calendar) => {
                    if (!calendar) {
                        throw new Error('Not Fount Calendar');
                    }
                    this.userActivityLogService.createActivityLog({
                        userId: calendar.userId as unknown as SchemaId,
                        activityType: UserActivityType.CALENDAR_DELETED,
                    });
                })
                .catch(() => {
                    this.notificationSlackService.send('[Calendar Delete] 로그 남기기 실패');
                });

            return { message: 'Success' };
        } catch (error) {
            throw new CustomExceptionHandler(error).handleException('Invalid ObjectId for diary calendar Id.', -3508);
        }
    }

    async withdrawalDiaryInfo(userId: string, session: ClientSession) {
        const entityIds = await this.diarySearcherService.getEntityIds(userId);

        if (!entityIds.length) {
            return;
        }

        await this.diaryEntityRepository.withdrawalEntity({ userId, isDeleted: false }, session);
        await this.imageDeleterService.deleteImageByTypeId(ImageType.Diary, entityIds, session);
        await this.diaryCalendarRepository.withdrawalCalendar({ userId, isDeleted: false }, session);
        await this.diaryWeightRepository.withdrawalWeight({ entityId: { $in: entityIds }, isDeleted: false }, session);
    }
}
