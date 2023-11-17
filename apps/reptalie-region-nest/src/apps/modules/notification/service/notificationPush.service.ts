import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { FCMMessage, FCMMulticastMessage, Notifee } from '../types';

export const NotificationPushServiceToken = 'NotificationPushServiceToken';

@Injectable()
export class NotificationPushService {
    constructor(private readonly http: HttpService, private readonly configService: ConfigService) {}

    async sendMessage(message: FCMMessage | FCMMulticastMessage) {
        const notifee = this._notifeeDataStringify(message.data);
        const postData = { ...message, data: notifee };
        const API_GATEWAY_URI = this.configService.get<string>('API_GATEWAY_URI');
        const X_API_KEY = this.configService.get<string>('X_API_KEY');
        this.http.post(API_GATEWAY_URI + '/notification', postData, {
            headers: {
                'x-api-key': X_API_KEY,
            },
        });
    }

    private _notifeeDataStringify(data?: { notifee: Notifee }) {
        if (data?.notifee) {
            return { notifee: JSON.stringify(data.notifee) };
        }

        return undefined;
    }
}
