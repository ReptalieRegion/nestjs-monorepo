import { Injectable, NotFoundException } from '@nestjs/common';
import { ImageType } from '../../../dto/image/input-image.dto';
import { ImageRepository } from '../image.repository';

export const ImageSearcherServiceToken = 'ImageSearcherServiceToken';

@Injectable()
export class ImageSearcherService {
    constructor(private readonly imageRepository: ImageRepository) {}

    async getProfileImage(typeId: string) {
        const profileImage = await this.imageRepository
            .findOne({ type: ImageType.Profile, typeId, isDeleted: false }, { imageKey: 1 })
            .exec();
            
        if (!profileImage) {
            throw new NotFoundException('Profile image not found.');
        }

        return { src: `${process.env.AWS_IMAGE_BASEURL}${profileImage.imageKey}` };
    }

    async getPostImages(typeId: string) {
        const postImages = await this.imageRepository
            .find({ type: ImageType.Share, typeId, isDeleted: false }, { imageKey: 1 })
            .exec();

        if (!postImages) {
            throw new NotFoundException('Post image not found.');
        }

        

        return postImages.map((entity) => ({ src: `${process.env.AWS_IMAGE_BASEURL}${entity.imageKey}` }));
    }
}
