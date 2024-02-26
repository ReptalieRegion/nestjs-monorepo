import { Provider } from '@nestjs/common';
import { UserActivityLogService, UserActivityLogServiceToken } from './userActivityLog.service';

export const UserActivityLogServiceProvider: Provider = {
    provide: UserActivityLogServiceToken,
    useClass: UserActivityLogService,
};
