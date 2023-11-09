import { Controller, Post, Inject, Body } from '@nestjs/common';

import { PushNotificationService, PushNotificationServiceToken } from '../notification/service/push-notification.service';

@Controller('notification')
export class NotificationController {
    constructor(
        @Inject(PushNotificationServiceToken)
        private readonly pushNotificationService: PushNotificationService,
    ) {}

    @Post('push/send')
    async send(@Body() body: { type: 'send'; token: string } | { type: 'sendMulticast'; tokens: string[] }) {
        /** 임시 데이터 */
        const temp = {
            data: {
                notifee: {
                    title: '진짜 가니??',
                    body: '해치웠나?',
                },
            },
            notification: {
                title: '진짜 가니??',
                body: '해치웠나?',
            },
            apns: {
                payload: {
                    aps: {
                        contentAvailable: true,
                        mutableContent: true,
                    },
                },
            },
        };

        switch (body.type) {
            case 'send':
                this.pushNotificationService.sendMessage({ token: body.token, ...temp });
                return;
            case 'sendMulticast':
                this.pushNotificationService.sendMessage({ tokens: body.tokens, ...temp });
                return;
        }
    }
}
