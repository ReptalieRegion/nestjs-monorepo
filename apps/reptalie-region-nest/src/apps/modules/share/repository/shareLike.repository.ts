import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { InputShareLikeDTO } from '../../../dto/share/like/input-shareLike.dto';
import { ShareLikeDocument, ShareLike } from '../../../schemas/shareLike.schema';
import { BaseRepository } from '../../base/base.repository';

@Injectable()
export class ShareLikeRepository extends BaseRepository<ShareLikeDocument> {
    constructor(@InjectModel(ShareLike.name) private readonly shareLikeModel: Model<ShareLikeDocument>) {
        super(shareLikeModel);
    }

    async createLike(likeInfo: InputShareLikeDTO) {
        const like = new this.shareLikeModel(likeInfo);
        const savedLike = await like.save();
        return savedLike.Mapper();
    }
}
