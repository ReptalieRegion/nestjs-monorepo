import { HttpStatus, Injectable } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { ImageType } from '../../../dto/image/input-image.dto';
import { CustomException } from '../../../utils/error/customException';
import { ImageRepository } from '../image.repository';

export const ImageUpdaterServiceToken = 'ImageUpdaterServiceToken';

@Injectable()
export class ImageUpdaterService {
    constructor(private readonly imageRepository: ImageRepository) {}

    /**
     * 유저 아이디를 변경합니다.
     *
     * @param imageId - 이미지의 타입 ID입니다.
     * @param userId - 생성할 이미지의 키 목록입니다.
     * @param session - 현재 세션입니다.
     * @returns 생성된 이미지 정보를 반환합니다.
     */
    async updateImage(imageId: string, userId: string, session: ClientSession) {
        const result = await this.imageRepository
            .updateOne({ _id: imageId }, { $set: { typeId: userId, isDeleted: false } }, { session })
            .exec();

        if (result.modifiedCount === 0) {
            throw new CustomException('Failed to update image.', HttpStatus.INTERNAL_SERVER_ERROR, -5603);
        }
    }

    /**
     * 특정 타입 및 타입 ID를 기반으로 이미지를 복원합니다.
     *
     * @param type - 이미지의 타입입니다.
     * @param typeId - 이미지의 타입 ID입니다.
     * @param session - 현재 세션입니다.
     */
    async restoreImageByTypeId(type: ImageType, typeIds: string[], session: ClientSession) {
        await this.imageRepository
            .updateMany({ typeId: { $in: typeIds }, type, isDeleted: true }, { $set: { isDeleted: false } }, { session })
            .exec();
    }
}
