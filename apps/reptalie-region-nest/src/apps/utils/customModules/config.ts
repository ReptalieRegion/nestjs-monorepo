import { ConfigModule } from '@nestjs/config';

const configs = () => {
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
        AWS_BUCKET: env.AWS_BUCKET,
        AWS_IMAGE_BASEURL: env.AWS_IMAGE_BASEURL,
        REDIS_URI: env.REDIS_URI,
    };
};

export const CustomConfigModule = ConfigModule.forRoot({ cache: true, isGlobal: true, load: [configs] });
