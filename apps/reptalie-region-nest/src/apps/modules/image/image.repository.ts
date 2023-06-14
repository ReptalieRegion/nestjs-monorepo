import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ImageDocument, Image } from '../../schemas/image.schema';
import { BaseRepository } from '../base/base.repository';

@Injectable()
export class ImageRepository extends BaseRepository<ImageDocument> {
    constructor(@InjectModel(Image.name) private readonly imageModel: Model<ImageDocument>) {
        super(imageModel);
    }
}
