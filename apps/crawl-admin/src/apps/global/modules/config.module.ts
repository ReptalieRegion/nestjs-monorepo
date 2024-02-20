import { ConfigModule } from '@nestjs/config';

export const configs = () => {
    const env = process.env;
    if (!env) {
        return {};
    }

    return {
        MONGODB_URI: env.MONGODB_URI,
        MODE: env.MODE,
        INTERATIONS: env.INTERATIONS,
        DKLEN: env.DKLEN,
        HASH: env.HASH,
        CRYPTO_SECRET_KEY: env.CRYPTO_SECRET_KEY,
        PUBLIC_SECRET_KEY: env.PUBLIC_SECRET_KEY,
        PRIVATE_SECRET_KEY: env.PRIVATE_SECRET_KEY,
        JWT_SECRET_KEY: env.JWT_SECRET_KEY,
        JWT_AUTH_SECRET_KEY: env.JWT_AUTH_SECRET_KEY,
        JWT_ACCESS_SECRET_KEY: env.JWT_ACCESS_SECRET_KEY,
        JWT_REFRESH_SECRET_KEY: env.JWT_REFRESH_SECRET_KEY,
        JWT_AUTH_TOKEN_TIME: env.JWT_AUTH_TOKEN_TIME,
        JWT_ACCESS_TOKEN_TIME: env.JWT_ACCESS_TOKEN_TIME,
        JWT_REFRESH_TOKEN_TIME: env.JWT_REFRESH_TOKEN_TIME,
        AWS_ACCESS_KEY_ID: env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: env.AWS_SECRET_ACCESS_KEY,
        AWS_REGION: env.AWS_REGION,
        USER_BASE_IMAGE: env.USER_BASE_IMAGE,
        AWS_BUCKET: env.AWS_BUCKET,
        AWS_IMAGE_BASEURL: env.AWS_IMAGE_BASEURL,
        REDIS_URI: env.REDIS_URI,
        GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
        CLIENT_EMAIL: env.CLIENT_EMAIL,
        PRIVATE_KEY: env.PRIVATE_KEY,
        PROJECT_ID: env.PROJECT_ID,
        SLACK_TOKEN: env.SLACK_TOKEN,
        IS_DEPLOY: env.IS_DEPLOY,
        API_GATEWAY_URI: env.API_GATEWAY_URI,
        X_API_KEY: env.X_API_KEY,
    };
};

export const GlobalConfigModule = ConfigModule.forRoot({
    cache: true,
    isGlobal: true,
    envFilePath: `${process.cwd()}/apps/crawl-admin/.env.${process.env.NODE_ENV}`,
    load: [configs],
});
