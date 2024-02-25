import { Injectable } from '@nestjs/common';
import { IUserActivityLog } from '@private-crawl/types';
import { UserActivityLogRepository } from './userActivityLog.repository';

export const UserActivityLogServiceToken = 'UserActivityLogServiceToken';

@Injectable()
export class UserActivityLogService {
    constructor(private readonly userActivityLogRepository: UserActivityLogRepository) {}

    async createActivityLog(logDTO: Omit<IUserActivityLog, '_id' | 'id' | 'createdAt'>) {
        if (logDTO.activityType && logDTO.userId) {
            return this.userActivityLogRepository.createUserActivityLog(logDTO);
        }
    }
}
