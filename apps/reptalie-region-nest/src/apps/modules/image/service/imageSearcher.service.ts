import { HttpStatus, Injectable } from '@nestjs/common';
import { ImageType } from '../../../dto/image/input-image.dto';
import { CustomException } from '../../../utils/error/customException';
import { ImageRepository } from '../image.repository';

export const ImageSearcherServiceToken = 'ImageSearcherServiceToken';

@Injectable()
export class ImageSearcherService {
    constructor(private readonly imageRepository: ImageRepository) {}

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
            throw new CustomException('Not found for the specified image.', HttpStatus.NOT_FOUND, -5302);
        }

        return postImages.map((entity) => ({ src: `${process.env.AWS_IMAGE_BASEURL}${entity.imageKey}` }));
    }

    /**
     * 프로필 이미지를 가져옵니다.
     *
     * @param typeId - 이미지의 타입 ID입니다.
     * @returns 가져온 게시물 이미지 정보를 배열로 반환합니다.
     */
    async getProfileImages(typeId: string) {
        const profileImages = await this.imageRepository
            .findOne({ type: ImageType.Profile, typeId, isDeleted: true })
            .sort({ createdAt: -1 })
            .exec();

        if (!profileImages) {
            throw new CustomException('Not found for the specified profile image.', HttpStatus.NOT_FOUND, -5302);
        }

        return profileImages.Mapper();
    }

    /**
     * 프로필 이미지를 가져옵니다.
     *
     * @param typeId - 이미지의 타입 ID입니다.
     * @returns 가져온 게시물 이미지 정보를 배열로 반환합니다.
     */
    async getDiaryImages(typeId: string) {
        const profileImages = await this.imageRepository
            .findOne({ type: ImageType.Diary, typeId, isDeleted: true })
            .sort({ createdAt: -1 })
            .exec();

        if (!profileImages) {
            throw new CustomException('Not found for the specified diary image.', HttpStatus.NOT_FOUND, -5302);
        }

        return profileImages.Mapper().id as string;
    }
}
