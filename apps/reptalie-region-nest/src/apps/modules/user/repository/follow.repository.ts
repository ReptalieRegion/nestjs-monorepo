import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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
}
