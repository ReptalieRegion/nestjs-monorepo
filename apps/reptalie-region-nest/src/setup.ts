import { NestExpressApplication } from '@nestjs/platform-express';
import axios from 'axios';
import passport from 'passport';
import { SLACK_NOTIFICATION_URI, SLACK_USERNAME } from './apps/modules/notification/constants/notificationSlack.constants';
import { CustomExceptionFilter } from './apps/utils/error/filter/customException.filter';

export const setup = (app: NestExpressApplication) => {
    // 라우터 URL 접두사
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);

    // 요청 데이터 검증 및 유효성 검사 파이프
    app.useGlobalFilters(new CustomExceptionFilter());

    // cors 설정
    const whitelist = ['http://localhost:3000'];
    app.enableCors({
        origin: whitelist,
        credentials: true,
    });

    // passport 미들웨어 초기화
    app.use(passport.initialize());

    try {
        if (process.env.IS_DEPLOY !== 'true') {
            return;
        }

        const SLACK_TOKEN = process.env.SLACK_TOKEN;
        if (SLACK_TOKEN === undefined) {
            return;
        }

        const headers = { 'Content-type': 'application/json', Authorization: `Bearer ${SLACK_TOKEN}` };
        const queryString = {
            channel: '서버-배포',
            text: '*[서버-배포] 완료*',
            token: SLACK_TOKEN,
            username: SLACK_USERNAME,
        };
        axios.post(SLACK_NOTIFICATION_URI, queryString, { headers }).catch(console.error);
    } catch (error) {
        console.log('[Slack] 메시지 보내기 실패');
    }
};
