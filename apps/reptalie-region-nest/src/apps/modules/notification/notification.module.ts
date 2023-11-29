import { Module, forwardRef } from '@nestjs/common';
import {
    MongooseModuleNotificationAgree,
    MongooseModuleNotificationLog,
    MongooseModuleNotificationTemplate,
} from '../../utils/customModules';
import { AuthModule } from '../auth/auth.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { UserModule } from '../user/user.module';
import { NotificationController } from './notification.controller';
import {
    NotificationAgreeServiceProvider,
    NotificationLogServiceProvider,
    NotificationPushServiceProvider,
    NotificationSlackServiceProvider,
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
        FirebaseModule,
        forwardRef(() => AuthModule),
        forwardRef(() => UserModule),
    ],
    controllers: [NotificationController],
    providers: [
        NotificationAgreeRepository,
        NotificationLogRepository,
        NotificationTemplateRepository,
        NotificationSlackServiceProvider,
        NotificationPushServiceProvider,
        NotificationAgreeServiceProvider,
        NotificationLogServiceProvider,
        NotificationTemplateServiceProvider,
    ],
    exports: [
        NotificationSlackServiceProvider,
        NotificationPushServiceProvider,
        NotificationAgreeServiceProvider,
        NotificationLogServiceProvider,
        NotificationTemplateServiceProvider,
    ],
})
export class NotificationModule {}
