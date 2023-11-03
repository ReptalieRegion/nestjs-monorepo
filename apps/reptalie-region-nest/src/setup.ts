import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import passport from 'passport';

export const setup = (app: NestExpressApplication) => {
    // 라우터 URL 접두사
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);

    // 요청 데이터 검증 및 유효성 검사 파이프
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    );

    // cors 설정
    const whitelist = ['http://localhost:3000'];
    app.enableCors({
        origin: whitelist,
        credentials: true,
    });

    // passport 미들웨어 초기화
    app.use(passport.initialize());
};
