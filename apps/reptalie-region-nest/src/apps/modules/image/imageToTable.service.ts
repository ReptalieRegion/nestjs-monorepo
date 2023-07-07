import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { ImageType, InputImageDTO } from '../../dto/image/input-image.dto';
import { ImageRepository } from './image.repository';

export const ImageToTableServiceToken = 'ImageToTableServiceToken';

@Injectable()
export class ImageToTableService {
    constructor(private readonly imageRepository: ImageRepository) {}

    async createImageFromShare(postId: string, imageKey: string[], session: ClientSession) {
        const inputImageDTO: InputImageDTO = {
            imageKey: imageKey,
            type: ImageType.Share,
            typeId: postId,
        };

        try {
            return await this.imageRepository.createImage(inputImageDTO, session);
        } catch (error) {
            if (error instanceof Error) {
                throw new InternalServerErrorException(error.message);
            }

            throw new BadRequestException('Failed to create image');
        }
    }
}
