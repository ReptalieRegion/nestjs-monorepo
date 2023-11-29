import { NotificationAgreeService, NotificationAgreeServiceToken } from './service/notificationAgree.service';
import { NotificationLogService, NotificationLogServiceToken } from './service/notificationLog.service';
import { NotificationPushService, NotificationPushServiceToken } from './service/notificationPush.service';
import { NotificationSlackService, NotificationSlackServiceToken } from './service/notificationSlack.service';
import { NotificationTemplateService, NotificationTemplateServiceToken } from './service/notificationTemplate.service';

export const NotificationPushServiceProvider = {
    provide: NotificationPushServiceToken,
    useClass: NotificationPushService,
};

export const NotificationTemplateServiceProvider = {
    provide: NotificationTemplateServiceToken,
    useClass: NotificationTemplateService,
};

export const NotificationLogServiceProvider = {
    provide: NotificationLogServiceToken,
    useClass: NotificationLogService,
};

export const NotificationAgreeServiceProvider = {
    provide: NotificationAgreeServiceToken,
    useClass: NotificationAgreeService,
};

export const NotificationSlackServiceProvider = {
    provide: NotificationSlackServiceToken,
    useClass: NotificationSlackService,
};
