import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'bson';
import { Model, ClientSession } from 'mongoose';

import { ImageDocument, Image } from '../../schemas/image.schema';
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

    async deleteImage(imageKeys: string[], typeId: string, session: ClientSession) {
        const response = await this.imageModel
            .updateMany(
                { typeId: new ObjectId(typeId), imageKey: { $in: imageKeys } },
                { $set: { isDeleted: true } },
                { session },
            )
            .exec();

        return response.modifiedCount;
    }
}
