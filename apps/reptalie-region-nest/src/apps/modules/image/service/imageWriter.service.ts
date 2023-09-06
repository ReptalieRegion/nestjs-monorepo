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
     * 이미지를 생성하고 반환합니다.
     * @param typeId - 이미지가 연결될 엔터티의 ID
     * @param imageKeys - 이미지 키 배열
     * @param type - 이미지의 종류
     * @param session - MongoDB 클라이언트 세션
     * @returns 생성된 이미지 객체
     * @throws BadRequestException 이미지 생성 실패 시
     */
    async createImage(typeId: string, imageKeys: string[], type: ImageType, session: ClientSession) {
        const images = imageKeys.map((value) => ({
            imageKey: value,
            type: type,
            typeId: typeId,
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
