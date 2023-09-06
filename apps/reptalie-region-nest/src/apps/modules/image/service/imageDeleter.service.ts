import { Injectable, NotFoundException } from '@nestjs/common';

import { ClientSession } from 'mongoose';
import { ImageRepository } from '../image.repository';

export const ImageDeleterServiceToken = 'ImageDeleterServiceToken';

@Injectable()
export class ImageDeleterService {
    constructor(private readonly imageRepository: ImageRepository) {}

    async deleteImage(imageKeys: string[], typeId: string, session: ClientSession) {
        const updateResult = await this.imageRepository.deleteImage(imageKeys, typeId, session);

        if (updateResult === 0) {
            throw new NotFoundException('Image not found');
        }
    }
}
