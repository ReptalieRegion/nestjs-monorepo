import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Follow, FollowDocument } from '@private-crawl/models';
import { ObjectId } from 'bson';
import { Model } from 'mongoose';

import { InputFollowDTO } from '../../../dto/user/follow/input-follow.dto';
import { BaseRepository } from '../../base/base.repository';

@Injectable()
export class FollowRepository extends BaseRepository<FollowDocument> {
    constructor(@InjectModel(Follow.name) private readonly followModel: Model<FollowDocument>) {
        super(followModel);
    }

    async createFollow(followerInfo: InputFollowDTO) {
        const follow = new this.followModel(followerInfo);
        const savedFollow = await follow.save();
        return savedFollow.Mapper();
    }

    async getAggregatedFollowerList(
        currentUserId: string,
        targetUserId: string,
        blockedIds: string[],
        pageParam: number,
        limitSize: number,
    ) {
        const blockedList = blockedIds.map((entity) => new ObjectId(entity));

        return this.followModel
            .aggregate([
                {
                    $match: { follower: new ObjectId(targetUserId), following: { $nin: blockedList }, isCanceled: false },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'following',
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
                        isMine: { $eq: ['$following', new ObjectId(currentUserId)] },
                    },
                },
                {
                    $sort: {
                        isMine: -1,
                    },
                },
                {
                    $project: {
                        following: 1,
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

    async getAggregatedFollowingList(
        currentUserId: string,
        targetUserId: string,
        blockedIds: string[],
        pageParam: number,
        limitSize: number,
    ) {
        const blockedList = blockedIds.map((entity) => new ObjectId(entity));

        return this.followModel
            .aggregate([
                {
                    $match: { following: new ObjectId(targetUserId), follower: { $nin: blockedList }, isCanceled: false },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'follower',
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
                        isMine: { $eq: ['$follower', new ObjectId(currentUserId)] },
                    },
                },
                {
                    $sort: {
                        isMine: -1,
                    },
                },
                {
                    $project: {
                        follower: 1,
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
}
