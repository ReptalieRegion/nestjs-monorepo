import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
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
    app.enableCors({
        origin: ['http://localhost:4200'],
        credentials: true,
    });

    // cookie 파싱
    app.use(cookieParser(process.env.COOKIE_SECRET_KEY));

    // passport 미들웨어 초기화
    app.use(passport.initialize());
};
