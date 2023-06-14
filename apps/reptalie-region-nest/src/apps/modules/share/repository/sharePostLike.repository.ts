import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SharePostLikeDocument, SharePostLike } from '../../../schemas/sharePostLike.schema';
import { BaseRepository } from '../../base/base.repository';

@Injectable()
export class SharePostLikeRepository extends BaseRepository<SharePostLikeDocument> {
    constructor(@InjectModel(SharePostLike.name) private readonly sharePostLikeModel: Model<SharePostLikeDocument>) {
        super(sharePostLikeModel);
    }
}
