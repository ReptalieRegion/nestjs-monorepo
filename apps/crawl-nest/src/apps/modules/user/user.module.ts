import { Module, forwardRef } from '@nestjs/common';

import { MongooseModuleFollow, MongooseModuleUser } from '../../utils/customModules';
import { AuthModule } from '../auth/auth.module';
import { ImageModule } from '../image/image.module';
import { NotificationModule } from '../notification/notification.module';
import { ReportModule } from '../report/report.module';
import { ShareModule } from '../share/share.module';
import { UserActivityLogModule } from '../user-activity-log/userActivityLog.module';
import { FollowRepository } from './repository/follow.repository';
import { UserRepository } from './repository/user.repository';
import { UserController } from './user.controller';
import {
    UserDeleterServiceProvider,
    UserSearcherServiceProvider,
    UserUpdaterServiceProvider,
    UserWriterServiceProvider,
} from './user.providers';

@Module({
    imports: [
        MongooseModuleUser,
        MongooseModuleFollow,
        UserActivityLogModule,
        ImageModule,
        forwardRef(() => ShareModule),
        forwardRef(() => AuthModule),
        forwardRef(() => NotificationModule),
        forwardRef(() => ReportModule),
    ],
    controllers: [UserController],
    providers: [
        UserRepository,
        FollowRepository,
        UserSearcherServiceProvider,
        UserWriterServiceProvider,
        UserUpdaterServiceProvider,
        UserDeleterServiceProvider,
    ],
    exports: [UserSearcherServiceProvider, UserWriterServiceProvider, UserUpdaterServiceProvider, UserDeleterServiceProvider],
})
export class UserModule {}
