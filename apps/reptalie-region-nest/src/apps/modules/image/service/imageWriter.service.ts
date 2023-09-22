import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { ImageType } from '../../../dto/image/input-image.dto';
import { getCurrentDate } from '../../../utils/time/time';
import { ImageRepository } from '../image.repository';

export const ImageWriterServiceToken = 'ImageWriterServiceToken';

@Injectable()
export class ImageWriterService {
    constructor(private readonly imageRepository: ImageRepository) {}

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
