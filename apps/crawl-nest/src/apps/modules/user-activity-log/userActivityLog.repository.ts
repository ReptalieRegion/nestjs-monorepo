import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserActivityLog, UserActivityLogDocument } from '@private-crawl/models';
import { Model } from 'mongoose';
import { BaseRepository } from '../base/base.repository';

@Injectable()
export class UserActivityLogRepository extends BaseRepository<UserActivityLogDocument> {
    constructor(@InjectModel(UserActivityLog.name) private readonly userActivityLogModel: Model<UserActivityLogDocument>) {
        super(userActivityLogModel);
    }

    async createUserActivityLog(logDTO: unknown) {
        const follow = new this.userActivityLogModel(logDTO);
        const savedFollow = await follow.save();
        return savedFollow.Mapper();
    }
}
