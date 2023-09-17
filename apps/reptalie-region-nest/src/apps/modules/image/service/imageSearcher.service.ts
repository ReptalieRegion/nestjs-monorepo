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

    async getPostImages(typeId: string) {
        const postImages = await this.imageRepository.findPostImages(typeId);

        if (!postImages) {
            throw new NotFoundException('Profile image not found.');
        }

        return postImages.map((entity) => ({ src: `${process.env.AWS_IMAGE_BASEURL}${entity.imageKey}` }));
    }
}
