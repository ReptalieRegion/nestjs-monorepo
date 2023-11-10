import { Controller, Post, Inject, Body } from '@nestjs/common';

import { PushNotificationService, PushNotificationServiceToken } from '../notification/service/push-notification.service';
import { BaseMessage } from './types';

@Controller('notification')
export class NotificationController {
    constructor(
        @Inject(PushNotificationServiceToken)
        private readonly pushNotificationService: PushNotificationService,
    ) {}

    @Post('push/send')
    async send(
        @Body()
        body: ({ type: 'send'; token: string } & BaseMessage) | ({ type: 'sendMulticast'; tokens: string[] } & BaseMessage),
    ) {
        if (body.type === 'send') {
            const { token, type, ...message } = body;
            this.pushNotificationService.sendMessage({ token, ...message });
            return;
        }

        if (body.type === 'sendMulticast') {
            const { tokens, type, ...message } = body;
            this.pushNotificationService.sendMessage({ tokens: tokens, ...message });
            return;
        }
    }
}
