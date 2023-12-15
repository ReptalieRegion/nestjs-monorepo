import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { ClientSession } from 'mongoose';
import { IDeleteWeightDTO } from '../../../dto/diary/weight/input-diaryWeight.dto';
import { ImageType } from '../../../dto/image/input-image.dto';
import { IUserProfileDTO } from '../../../dto/user/user/response-user.dto';
import { serviceErrorHandler } from '../../../utils/error/errorHandler';
import { ImageDeleterService, ImageDeleterServiceToken } from '../../image/service/imageDeleter.service';
import { DiaryCalendarRepository } from '../repository/diaryCalendar.repository';
import { DiaryEntityRepository } from '../repository/diaryEntity.repository';
import { DiaryWeightRepository } from '../repository/diaryWeight.repository';

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
    ) {}

    async deleteEntity(user: IUserProfileDTO, entityId: string) {
        const session: ClientSession = await this.connection.startSession();
        session.startTransaction();

        try {
            const entityResult = await this.diaryEntityRepository
                .updateOne({ userId: user.id, _id: entityId, isDeleted: false }, { $set: { isDeleted: true } }, { session })
                .exec();

            if (entityResult.modifiedCount === 0) {
                throw new InternalServerErrorException('Failed to delete diary entity.');
            }

            await this.imageDeleterService.deleteImageByTypeId(ImageType.Diary, entityId, session);
            await this.diaryWeightRepository
                .updateMany({ entityId, isDeleted: false }, { $set: { isDeleted: true } }, { session })
                .exec();

            await session.commitTransaction();

            return { message: 'Success' };
        } catch (error) {
            await session.abortTransaction();
            serviceErrorHandler(error, 'Invalid ObjectId for diary entity Id.');
        } finally {
            await session.endSession();
        }
    }

    async deleteWeight(entityId: string, dto: IDeleteWeightDTO) {
        try {
            const result = await this.diaryWeightRepository
                .updateOne({ entityId, date: dto.date, isDeleted: false }, { $set: { isDeleted: true } })
                .exec();

            if (result.modifiedCount === 0) {
                throw new InternalServerErrorException('Failed to delete diary entity weight.');
            }

            return { message: 'Success' };
        } catch (error) {
            serviceErrorHandler(error, 'Invalid ObjectId for diary entity Id.');
        }
    }

    async deleteCalendar(calendarId: string) {
        try {
            const result = await this.diaryCalendarRepository
                .updateOne({ _id: calendarId, isDeleted: false }, { $set: { isDeleted: true } })
                .exec();

            if (result.modifiedCount === 0) {
                throw new InternalServerErrorException('Failed to delete diary entity calendar.');
            }

            return { message: 'Success' };
        } catch (error) {
            serviceErrorHandler(error, 'Invalid ObjectId for diary calendar Id.');
        }
    }
}
