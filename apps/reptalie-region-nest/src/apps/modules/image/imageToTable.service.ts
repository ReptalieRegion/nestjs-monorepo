import { Injectable } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { ImageType, InputImageDTO } from '../../dto/image/input-image.dto';
import { ImageRepository } from './image.repository';

export const ImageToTableServiceToken = 'ImageToTableServiceToken';

@Injectable()
export class ImageToTableService {
    constructor(private readonly imageRepository: ImageRepository) {}

    async createImage(postId: string, imageKey: string[], session: ClientSession) {
        throw new Error('이미지 테이블 생성 에러')
        const inputImageDTO: InputImageDTO = {
            imageKey: imageKey,
            type: ImageType.Share,
            typeId: postId,
        };

        return this.imageRepository.createImage(inputImageDTO, session);
    }
}
