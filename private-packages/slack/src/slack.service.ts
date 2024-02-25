import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { SLACK_MODULE_USER_OPTIONS, SLACK_NOTIFICATION_URI, SLACK_USERNAME } from './constants';
import { SlackConfig } from './types';

@Injectable()
export class SlackService {
    constructor(@Inject(SLACK_MODULE_USER_OPTIONS) private readonly options: SlackConfig) {}

    async sendMultipleChannels({ text, channels }: { text: string; channels: string[] }) {
        await Promise.all(channels.map((channel) => this.send(text, channel)));
    }

    async send(text: string, channel: string) {
        const token = this.options.token;
        if (token === undefined) {
            return;
        }

        const headers = { 'Content-type': 'application/json', Authorization: `Bearer ${token}` };
        const queryString = {
            channel: channel ?? this.options.defaultChannel,
            text,
            token,
            username: SLACK_USERNAME,
        };
        axios.post(SLACK_NOTIFICATION_URI, queryString, { headers }).catch(console.error);
    }
}
