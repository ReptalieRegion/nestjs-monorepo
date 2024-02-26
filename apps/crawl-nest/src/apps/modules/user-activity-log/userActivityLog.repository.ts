import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserActivityLog, UserActivityLogDocument } from '@private-crawl/models';
import { IUserActivityLog } from '@private-crawl/types';
import { Model } from 'mongoose';
import { BaseRepository } from '../base/base.repository';

@Injectable()
export class UserActivityLogRepository extends BaseRepository<UserActivityLogDocument> {
    constructor(@InjectModel(UserActivityLog.name) private readonly userActivityLogModel: Model<UserActivityLogDocument>) {
        super(userActivityLogModel);
    }

    async createUserActivityLog(logDTO: Omit<IUserActivityLog, '_id' | 'id' | 'createdAt'>) {
        const userActivityLog = new this.userActivityLogModel(logDTO);
        const savedUserActivityLog = await userActivityLog.save();
        return savedUserActivityLog.Mapper();
    }
}
