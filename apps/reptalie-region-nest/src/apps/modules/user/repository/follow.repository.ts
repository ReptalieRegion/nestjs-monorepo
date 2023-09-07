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

    async findFollowingWithFollowerByIsCancled(following: string, follower: string) {
        const follow = await this.followModel
            .findOne({ following: new ObjectId(following), follower: new ObjectId(follower) }, { _id: 1, isCancled: 1 })
            .exec();
        return follow?.Mapper();
    }

    async updateIsCancledById(id: string, isCancled: boolean) {
        const response = await this.followModel.updateOne({ _id: new ObjectId(id) }, { $set: { isCancled: !isCancled } });
        return response.modifiedCount;
    }
}
