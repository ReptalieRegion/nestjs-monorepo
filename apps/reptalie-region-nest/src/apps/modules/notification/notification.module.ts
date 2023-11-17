import { HttpModule } from '@nestjs/axios';
import { Module, forwardRef } from '@nestjs/common';
import {
    MongooseModuleNotificationAgree,
    MongooseModuleNotificationLog,
    MongooseModuleNotificationTemplate,
} from '../../utils/customModules';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { NotificationController } from './notification.controller';
import {
    NotificationPushServiceProvider,
    NotificationAgreeServiceProvider,
    NotificationLogServiceProvider,
    NotificationTemplateServiceProvider,
} from './notification.providers';
import { NotificationAgreeRepository } from './repository/notificationAgree.repository';
import { NotificationLogRepository } from './repository/notificationLog.repository';
import { NotificationTemplateRepository } from './repository/notificationTemplate.repository';

@Module({
    imports: [
        MongooseModuleNotificationAgree,
        MongooseModuleNotificationLog,
        MongooseModuleNotificationTemplate,
        HttpModule,
        forwardRef(() => AuthModule),
        UserModule,
    ],
    controllers: [NotificationController],
    providers: [
        NotificationAgreeRepository,
        NotificationLogRepository,
        NotificationTemplateRepository,
        NotificationPushServiceProvider,
        NotificationAgreeServiceProvider,
        NotificationLogServiceProvider,
        NotificationTemplateServiceProvider,
    ],
    exports: [
        NotificationPushServiceProvider,
        NotificationAgreeServiceProvider,
        NotificationLogServiceProvider,
        NotificationTemplateServiceProvider,
    ],
})
export class NotificationModule {}
