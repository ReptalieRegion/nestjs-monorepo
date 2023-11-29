import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { ImageType } from '../../../dto/image/input-image.dto';
import { getCurrentDate } from '../../../utils/time/time';
import { ImageRepository } from '../image.repository';

export const ImageWriterServiceToken = 'ImageWriterServiceToken';

@Injectable()
export class ImageWriterService {
    constructor(private readonly imageRepository: ImageRepository) {}

    /**
     * 이미지를 생성합니다.
     *
     * @param typeId - 이미지의 타입 ID입니다.
     * @param imageKeys - 생성할 이미지의 키 목록입니다.
     * @param type - 이미지의 타입입니다.
     * @param session - 현재 세션입니다.
     * @returns 생성된 이미지 정보를 반환합니다.
     */
    async createImage(typeId: string, imageKeys: string[], type: ImageType, session: ClientSession) {
        const images = imageKeys.map((value) => ({
            imageKey: value,
            type,
            typeId,
            createdAt: getCurrentDate(),
            updatedAt: getCurrentDate(),
        }));

        const createdImage = await this.imageRepository.createImage(images, session);

        if (!createdImage) {
            throw new InternalServerErrorException('Failed to create image');
        }

        return createdImage;
    }
}
