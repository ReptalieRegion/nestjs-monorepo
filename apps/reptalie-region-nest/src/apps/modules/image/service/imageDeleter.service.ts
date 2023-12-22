import { Injectable, NotFoundException } from '@nestjs/common';

import { ClientSession } from 'mongoose';
import { ImageType } from '../../../dto/image/input-image.dto';
import { ImageRepository } from '../image.repository';

export const ImageDeleterServiceToken = 'ImageDeleterServiceToken';

@Injectable()
export class ImageDeleterService {
    constructor(private readonly imageRepository: ImageRepository) {}

    /**
     * 이미지 키 목록을 기반으로 이미지를 삭제합니다.
     *
     * @param imageKeys - 삭제하지 않고 남은 이미지 키 배열입니다.
     * @param typeId - 이미지의 타입 ID입니다.
     * @param session - 현재 세션입니다.
     */
    async deleteImageByImageKeys(imageKeys: string[], typeId: string, session: ClientSession) {
        const images = await this.imageRepository.find({ typeId, isDeleted: false }).exec();

        if (images.length !== imageKeys.length) {
            const result = await this.imageRepository
                .updateMany(
                    { typeId, imageKey: { $nin: imageKeys }, isDeleted: false },
                    { $set: { isDeleted: true } },
                    { session },
                )
                .exec();

            if (result.modifiedCount === 0) {
                throw new NotFoundException('Image not found');
            }
        }
    }

    /**
     * 특정 타입 및 타입 ID를 기반으로 이미지를 삭제합니다.
     *
     * @param type - 이미지의 타입입니다.
     * @param typeId - 이미지의 타입 ID입니다.
     * @param session - 현재 세션입니다.
     */
    async deleteImageByTypeId(type: ImageType, typeId: string, session: ClientSession) {
        const result = await this.imageRepository
            .updateMany({ typeId, type, isDeleted: false }, { $set: { isDeleted: true } }, { session })
            .exec();

        if (result.modifiedCount === 0) {
            throw new NotFoundException('Image not found');
        }
    }
}
