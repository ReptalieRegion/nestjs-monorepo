import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { IUpdateEntityDTO } from '../../../dto/diary/entity/input-diaryEntity.dto';
import { IUpdateWeightDTO } from '../../../dto/diary/weight/input-diaryWeight.dto';
import { IUserProfileDTO } from '../../../dto/user/user/response-user.dto';
import { serviceErrorHandler } from '../../../utils/error/errorHandler';
import { DiaryEntityRepository } from '../repository/diaryEntity.repository';
import { DiaryWeightRepository } from '../repository/diaryWeight.repository';

export const DiaryUpdaterServiceToken = 'DiaryUpdaterServiceToken';

@Injectable()
export class DiaryUpdaterService {
    constructor(
        private readonly diaryEntityRepository: DiaryEntityRepository,
        private readonly diaryWeightRepository: DiaryWeightRepository,
    ) {}

    async updateEntity(user: IUserProfileDTO, entityId: string, dto: IUpdateEntityDTO) {
        try {
            const result = await this.diaryEntityRepository
                .updateOne({ _id: entityId, userId: user.id, isDeleted: false }, { $set: { ...dto } })
                .exec();

            if (result.modifiedCount === 0) {
                throw new InternalServerErrorException('Failed to update diary entity.');
            }

            return { message: 'Success' };
        } catch (error) {
            serviceErrorHandler(error, 'Invalid ObjectId for diary entity Id.');
        }
    }

    async updateWeight(weightId: string, dto: IUpdateWeightDTO) {
        try {
            const result = await this.diaryWeightRepository
                .updateOne({ _id: weightId, isDeleted: false }, { $set: { ...dto } })
                .exec();

            if (result.modifiedCount === 0) {
                throw new InternalServerErrorException('Failed to update diary weight.');
            }

            return { message: 'Success' };
        } catch (error) {
            serviceErrorHandler(error, 'Invalid ObjectId for diary entity Id.');
        }
    }

    /**
     * 다이어리의 이미지 ID를 업데이트합니다.
     *
     * @param _id - 사용자 ID
     * @param imageId - 새로운 이미지 ID
     * @param session - MongoDB 클라이언트 세션
     */
    async updateImageId(_id: string, imageId: string, session: ClientSession) {
        const result = await this.diaryEntityRepository.updateOne({ _id }, { $set: { imageId } }, { session }).exec();

        if (result.modifiedCount === 0) {
            throw new InternalServerErrorException('Failed to update image Id.');
        }
    }
}
