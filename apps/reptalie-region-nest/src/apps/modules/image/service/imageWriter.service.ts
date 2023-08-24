import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { ImageType, InputImageDTO } from '../../../dto/image/input-image.dto';
import { ImageRepository } from '../image.repository';

export const ImageWriterServiceToken = 'ImageWriterServiceToken';

@Injectable()
export class ImageWriterService {
    constructor(private readonly imageRepository: ImageRepository) {}

    async createImage(id: string, imageKeys: string[], type: ImageType, session: ClientSession) {
        const inputImageDTO: InputImageDTO = {
            imageKeys: imageKeys,
            type: type,
            typeId: id,
        };

        try {
            return this.imageRepository.createImage(inputImageDTO, session);
        } catch (error) {
            if (error instanceof Error) {
                throw new InternalServerErrorException(error.message);
            }

            throw new BadRequestException('Failed to create image');
        }
    }
}
