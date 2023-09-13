import { Injectable, NotFoundException } from '@nestjs/common';
import { ImageRepository } from '../image.repository';

export const ImageSearcherServiceToken = 'ImageSearcherServiceToken';

@Injectable()
export class ImageSearcherService {
    constructor(private readonly imageRepository: ImageRepository) {}

    async getUserProfileImage(typeId: string) {
        const profileImage = await this.imageRepository.findProfileImage(typeId);

        if (!profileImage) {
            throw new NotFoundException('Profile image not found.');
        }

        return { src: `${process.env.AWS_IMAGE_BASEURL}${profileImage.imageKey}` };
    }
}
