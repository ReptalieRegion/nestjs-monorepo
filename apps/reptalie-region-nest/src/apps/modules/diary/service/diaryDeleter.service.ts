import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IDeleteWeightDTO } from '../../../dto/diary/weight/input-diaryWeight.dto';
import { IUserProfileDTO } from '../../../dto/user/user/response-user.dto';
import { serviceErrorHandler } from '../../../utils/error/errorHandler';
import { DiaryEntityRepository } from '../repository/diaryEntity.repository';
import { DiaryWeightRepository } from '../repository/diaryWeight.repository';

export const DiaryDeleterServiceToken = 'DiaryDeleterServiceToken';

@Injectable()
export class DiaryDeleterService {
    constructor(
        private readonly diaryEntityRepository: DiaryEntityRepository,
        private readonly diaryWeightRepository: DiaryWeightRepository,
    ) {}

    async deleteEntity(user: IUserProfileDTO, entityId: string) {
        try {
            const entityResult = await this.diaryEntityRepository
                .updateOne({ userId: user.id, _id: entityId, isDeleted: false }, { $set: { isDeleted: true } })
                .exec();

            if (entityResult.modifiedCount === 0) {
                throw new InternalServerErrorException('Failed to delete diary entity.');
            }

            await this.diaryWeightRepository.updateMany({ entityId, isDeleted: false }, { $set: { isDeleted: true } }).exec();

            return { message: 'Success' };
        } catch (error) {
            serviceErrorHandler(error, 'Invalid ObjectId for diary entity Id.');
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
}
