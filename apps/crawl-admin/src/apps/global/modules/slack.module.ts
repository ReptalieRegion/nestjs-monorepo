import { SlackModule } from '@private-crawl/slack';

export const GlobalSlackModule = SlackModule.forRoot({
    type: 'api',
    defaultChannel: '개발채널',
    token: process.env.SLACK_TOKEN ?? '',
    isGlobal: true,
});
