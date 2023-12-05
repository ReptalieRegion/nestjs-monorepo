import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IUserProfileDTO } from '../../../dto/user/user/response-user.dto';
import { serviceErrorHandler } from '../../../utils/error/errorHandler';
import { DiaryEntityRepository } from '../repository/diaryEntity.repository';

export const DiaryDeleterServiceToken = 'DiaryDeleterServiceToken';

@Injectable()
export class DiaryDeleterService {
    constructor(private readonly diaryEntityRepository: DiaryEntityRepository) {}

    async deleteEntity(user: IUserProfileDTO, diaryId: string) {
        try {
            const result = await this.diaryEntityRepository
                .updateOne({ _id: diaryId, userId: user.id, isDeleted: false }, { $set: { isDeleted: true } })
                .exec();

            if (result.modifiedCount === 0) {
                throw new InternalServerErrorException('Failed to delete diary entity.');
            }

            return { message: 'Success' };
        } catch (error) {
            serviceErrorHandler(error, 'Invalid ObjectId for diary entity Id.');
        }
    }

    // async deleteWeight(user: IUserProfileDTO, diaryId: string, dto: BasicWeight) {
    //     try {
    //         const result = await this.diaryEntityRepository
    //             .updateOne(
    //                 { _id: diaryId, userId: user.id, isDeleted: false },
    //                 { $pull: { weight: { date: dto.date, weight: dto.weight } } },
    //             )
    //             .exec();

    //         if (result.modifiedCount === 0) {
    //             throw new InternalServerErrorException('Failed to delete diary entity weight.');
    //         }

    //         return { message: 'Success' };
    //     } catch (error) {
    //         serviceErrorHandler(error, 'Invalid ObjectId for diary entity Id.');
    //     }
    // }
}
