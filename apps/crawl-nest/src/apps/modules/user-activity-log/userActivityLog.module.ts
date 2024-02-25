import { Module } from '@nestjs/common';
import { MongooseModuleUserActivityLog } from '../../utils/customModules';
import { UserActivityLogServiceProvider } from './userActivityLog.providers';
import { UserActivityLogRepository } from './userActivityLog.repository';

@Module({
    imports: [MongooseModuleUserActivityLog],
    providers: [UserActivityLogRepository, UserActivityLogServiceProvider],
    exports: [UserActivityLogServiceProvider],
})
export class UserActivityLogModule {}
