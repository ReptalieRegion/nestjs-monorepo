import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { PushNotificationServiceProvider } from './notification.providers';

@Module({
    imports: [HttpModule],
    controllers: [NotificationController],
    providers: [PushNotificationServiceProvider],
    exports: [PushNotificationServiceProvider],
})
export class NotificationModule {}
