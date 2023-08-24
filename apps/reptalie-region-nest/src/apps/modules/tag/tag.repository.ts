import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';

import { TagDocument, Tag } from '../../schemas/tag.schema';
import { BaseRepository } from '../base/base.repository';

@Injectable()
export class TagRepository extends BaseRepository<TagDocument> {
    constructor(@InjectModel(Tag.name) private readonly tagModel: Model<TagDocument>) {
        super(tagModel);
    }

    async createTag(tagInfo: object[], session: ClientSession) {
        const tag = await this.tagModel.insertMany(tagInfo, { session });
        return tag.map((entity) => entity.Mapper());
    }
}
