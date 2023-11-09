import { Provider } from '@nestjs/common';
import { PushNotificationService, PushNotificationServiceToken } from './service/push-notification.service';

const PushNotificationServiceProvider: Provider = {
    provide: PushNotificationServiceToken,
    useClass: PushNotificationService,
};

export { PushNotificationServiceProvider };
