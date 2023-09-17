import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'bson';
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

    async findLikeByIsCanceled(userId: string, postId: string) {
        const like = await this.shareLikeModel
            .findOne({ userId: new ObjectId(userId), postId: new ObjectId(postId) }, { _id: 1, isCanceled: 1 })
            .exec();
        return like?.Mapper();
    }

    async updateLike(id: string, isCanceled: boolean) {
        const response = await this.shareLikeModel.updateOne({ _id: new ObjectId(id) }, { $set: { isCanceled: !isCanceled } });
        return response.modifiedCount;
    }

    async findLikeCheck(userId: string, postId: string) {
        const like = await this.shareLikeModel
            .findOne({ userId: new ObjectId(userId), postId: new ObjectId(postId), isCanceled: false }, { _id: 1 })
            .exec();
        return like ? true : false;
    }
}