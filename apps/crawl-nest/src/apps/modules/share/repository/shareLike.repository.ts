import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ShareLike, ShareLikeDocument } from '@private-crawl/models';
import { ObjectId } from 'bson';
import mongoose, { ClientSession, Model } from 'mongoose';

import { InputShareLikeDTO } from '../../../dto/share/like/input-shareLike.dto';
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

    async getAggregatedLikeList(postId: string, userId: string, blockedIds: string[], pageParam: number, limitSize: number) {
        const blockedList = blockedIds.map((entity) => new ObjectId(entity));

        return this.shareLikeModel
            .aggregate([
                {
                    $match: { postId: new ObjectId(postId), userId: { $nin: blockedList }, isCanceled: false },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userDetails',
                    },
                },
                {
                    $unwind: '$userDetails',
                },
                {
                    $lookup: {
                        from: 'images',
                        localField: 'userDetails.imageId',
                        foreignField: '_id',
                        as: 'userImage',
                    },
                },
                {
                    $unwind: { path: '$userImage' },
                },
                {
                    $addFields: {
                        isMine: { $eq: ['$userId', new ObjectId(userId)] },
                    },
                },
                {
                    $sort: {
                        isMine: -1,
                    },
                },
                {
                    $project: {
                        userId: 1,
                        userDetails: {
                            nickname: 1,
                            imageId: 1,
                        },
                        userImage: {
                            imageKey: 1,
                        },
                        isMine: 1,
                    },
                },
                {
                    $skip: pageParam * limitSize,
                },
                {
                    $limit: limitSize,
                },
            ])
            .exec();
    }

    async withdrawalLike(query: mongoose.FilterQuery<ShareLikeDocument>, session: ClientSession) {
        await this.shareLikeModel.updateMany(query, { $set: { isCanceled: true } }, { session }).exec();
    }

    async restoreLike(oldUserId: string, newUserId: string, session: ClientSession) {
        await this.shareLikeModel
            .updateMany(
                { userId: oldUserId, isCanceled: true },
                { $set: { userId: newUserId, isCanceled: false } },
                { session },
            )
            .exec();
    }
}
