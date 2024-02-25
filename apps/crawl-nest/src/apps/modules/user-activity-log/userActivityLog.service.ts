import { Injectable } from '@nestjs/common';
import { UserActivityLogRepository } from './userActivityLog.repository';

export const UserActivityLogServiceToken = 'UserActivityLogServiceToken';

@Injectable()
export class UserActivityLogService {
    constructor(private readonly userActivityLogRepository: UserActivityLogRepository) {}
}
