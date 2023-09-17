import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'bson';
import { Model } from 'mongoose';

import { InputFollowDTO } from '../../../dto/follow/input-follow.dto';
import { FollowDocument, Follow } from '../../../schemas/follow.schema';
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

    async findFollowByIsCanceled(following: string, follower: string) {
        const follow = await this.followModel
            .findOne({ following: new ObjectId(following), follower: new ObjectId(follower) }, { _id: 1, isCanceled: 1 })
            .exec();
        return follow?.Mapper();
    }

    async updateFollow(id: string, isCanceled: boolean) {
        const response = await this.followModel.updateOne({ _id: new ObjectId(id) }, { $set: { isCanceled: !isCanceled } });
        return response.modifiedCount;
    }

    async findFollowRelationship(currentUserId: string, targetUserId: string) {
        const follow = await this.followModel
            .findOne({ following: new ObjectId(currentUserId), follower: new ObjectId(targetUserId) }, { isCanceled: 1 })
            .exec();
        return follow?.Mapper();
    }

    async findFollowersForInfiniteScroll(following: string, search: string, pageParams: number, limitSize: number) {
        const followers = await this.followModel
            .find(
                {
                    following: new ObjectId(following),
                    isCanceled: false,
                    followerNickname: { $regex: new RegExp(`^${search}`, 'i') },
                },
                { follower: 1, followerNickname: 1 },
            )
            .skip(pageParams * limitSize)
            .limit(limitSize)
            .exec();

        const isLastPage = followers.length < limitSize;

        return {
            followers: followers.map((entity) => entity.Mapper()),
            isLastPage: isLastPage,
            pageParams: pageParams + 1,
        };
    }

    async findUserFollowers(userId: string) {
        const followers = await this.followModel
            .find({ following: new ObjectId(userId), isCanceled: false }, { follower: 1 })
            .exec();
        return followers.map((entity) => entity.Mapper().id as string);
    }
}