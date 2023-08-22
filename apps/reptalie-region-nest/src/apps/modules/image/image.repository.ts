import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';

import { InputImageDTO } from '../../dto/image/input-image.dto';
import { ImageDocument, Image } from '../../schemas/image.schema';
import { BaseRepository } from '../base/base.repository';

@Injectable()
export class ImageRepository extends BaseRepository<ImageDocument> {
    constructor(@InjectModel(Image.name) private readonly imageModel: Model<ImageDocument>) {
        super(imageModel);
    }

    async createImage(imageInfo: InputImageDTO, session: ClientSession) {
        const image = new this.imageModel(imageInfo);
        const savedImage = await image.save({ session });
        return savedImage.Mapper();
    }
}
