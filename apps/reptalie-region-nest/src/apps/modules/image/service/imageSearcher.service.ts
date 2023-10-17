import { Injectable, NotFoundException } from '@nestjs/common';
import { ImageType } from '../../../dto/image/input-image.dto';
import { ImageRepository } from '../image.repository';

export const ImageSearcherServiceToken = 'ImageSearcherServiceToken';

@Injectable()
export class ImageSearcherService {
    constructor(private readonly imageRepository: ImageRepository) {}

    /**
     * 프로필 이미지를 가져옵니다.
     *
     * @param typeId - 이미지의 타입 ID입니다.
     * @returns 가져온 프로필 이미지 정보를 반환합니다.
     */
    async getProfileImage(typeId: string) {
        const profileImage = await this.imageRepository
            .findOne({ type: ImageType.Profile, typeId, isDeleted: false }, { imageKey: 1 })
            .exec();

        if (!profileImage) {
            throw new NotFoundException('Profile image not found.');
        }

        return { src: `${process.env.AWS_IMAGE_BASEURL}${profileImage.imageKey}` };
    }

    /**
     * 게시물 이미지를 가져옵니다.
     *
     * @param typeId - 이미지의 타입 ID입니다.
     * @returns 가져온 게시물 이미지 정보를 배열로 반환합니다.
     */
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
