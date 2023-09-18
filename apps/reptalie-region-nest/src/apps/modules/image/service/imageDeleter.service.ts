import { Injectable, NotFoundException } from '@nestjs/common';

import { ClientSession } from 'mongoose';
import { ImageType } from '../../../dto/image/input-image.dto';
import { ImageRepository } from '../image.repository';

export const ImageDeleterServiceToken = 'ImageDeleterServiceToken';

@Injectable()
export class ImageDeleterService {
    constructor(private readonly imageRepository: ImageRepository) {}

    async deleteImageByImageKeys(imageKeys: string[], typeId: string, session: ClientSession) {
        const deleteResult = await this.imageRepository.deleteImageByImageKeys(imageKeys, typeId, session);

        if (deleteResult === 0) {
            throw new NotFoundException('Image not found');
        }
    }

    async deleteImageByTypeId(type: ImageType, typeId: string, session: ClientSession) {
        const deleteResult = await this.imageRepository.deleteImageByTypeId(type, typeId, session);

        if (deleteResult === 0) {
            throw new NotFoundException('Image not found');
        }
    }
}
