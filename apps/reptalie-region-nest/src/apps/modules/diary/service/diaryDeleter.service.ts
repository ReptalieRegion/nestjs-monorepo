import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { ClientSession } from 'mongoose';
import { ImageType } from '../../../dto/image/input-image.dto';
import { IUserProfileDTO } from '../../../dto/user/user/response-user.dto';
import { CustomException } from '../../../utils/error/customException';
import { CustomExceptionHandler } from '../../../utils/error/customException.handler';
import { ImageDeleterService, ImageDeleterServiceToken } from '../../image/service/imageDeleter.service';
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

        await this.diaryEntityRepository.deleteEntity({ userId, isDeleted: false }, session);
        await this.diaryCalendarRepository.deleteCalendar({ userId, isDeleted: false }, session);
        await this.diaryWeightRepository.deleteWeight({ entityId: { $in: entityIds }, isDeleted: false }, session);
    }
}
