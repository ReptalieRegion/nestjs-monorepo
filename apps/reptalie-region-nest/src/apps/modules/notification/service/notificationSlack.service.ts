import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { SLACK_NOTIFICATION_URI, SLACK_USERNAME } from '../constants/notificationSlack.constants';
import { QueryString } from '../types/notificationSlack.types';

export const NotificationSlackServiceToken = 'NotificationPushServiceToken';

@Injectable()
export class NotificationSlackService {
    constructor(private readonly configService: ConfigService) {}

    async sendMultipleChannels({ text, channels }: { text: string; channels: string[] }) {
        await Promise.all(channels.map((channel) => this.send(text, channel)));
    }

    async send(text: string, channel = '개발채널') {
        const SLACK_TOKEN = this.configService.get('SLACK_TOKEN');
        if (SLACK_TOKEN === undefined) {
            return;
        }

        const headers = { 'Content-type': 'application/json', Authorization: `Bearer ${SLACK_TOKEN}` };
        const queryString: QueryString = {
            channel,
            text,
            token: SLACK_TOKEN,
            username: SLACK_USERNAME,
        };
        axios.post(SLACK_NOTIFICATION_URI, queryString, { headers }).catch(console.error);
    }
}
