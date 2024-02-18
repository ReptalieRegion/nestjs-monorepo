import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Image, ImageDocument } from '@private-crawl/models';
import { ClientSession, Model } from 'mongoose';

import { BaseRepository } from '../base/base.repository';

@Injectable()
export class ImageRepository extends BaseRepository<ImageDocument> {
    constructor(@InjectModel(Image.name) private readonly imageModel: Model<ImageDocument>) {
        super(imageModel);
    }

    async createImage(imageInfo: object[], session: ClientSession) {
        const image = await this.imageModel.insertMany(imageInfo, { session });
        return image.map((entitiy) => entitiy.Mapper());
    }
}
