import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { IUpdateEntityDTO } from '../../../dto/diary/entity/input-diaryEntity.dto';
import { IUserProfileDTO } from '../../../dto/user/user/response-user.dto';
import { serviceErrorHandler } from '../../../utils/error/errorHandler';
import { DiaryEntityRepository } from '../repository/diaryEntity.repository';

export const DiaryUpdaterServiceToken = 'DiaryUpdaterServiceToken';

@Injectable()
export class DiaryUpdaterService {
    constructor(private readonly diaryEntityRepository: DiaryEntityRepository) {}

    async updateEntity(user: IUserProfileDTO, diaryId: string, dto: IUpdateEntityDTO) {
        try {
            const result = await this.diaryEntityRepository
                .updateOne({ _id: diaryId, userId: user.id, isDeleted: false }, { $set: { ...dto } })
                .exec();

            if (result.modifiedCount === 0) {
                throw new InternalServerErrorException('Failed to update diary entity.');
            }
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
