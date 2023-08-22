import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { TagType } from '../../../dto/tag/input-tag.dto';
import { TagRepository } from '../tag.repository';

export const TagWriterServiceToken = 'TagWriterServiceToken';

@Injectable()
export class TagWriterService {
    constructor(private readonly tagRepository: TagRepository) {}

    async createTag(id: string, type: TagType, tagUserId: string[], session: ClientSession) {
        try {
            const tags = tagUserId.map((value) => ({
                type: type,
                typeId: id,
                tagUserId: value,
            }));

            await this.tagRepository.createTag(tags, session);
        } catch (error) {
            if (error instanceof Error) {
                throw new InternalServerErrorException(error.message);
            }

            throw new BadRequestException('Failed to create tag');
        }
    }
}
