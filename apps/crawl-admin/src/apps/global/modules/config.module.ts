import { ConfigModule } from '@nestjs/config';

export const configs = () => {
    const env = process.env;
    if (!env) {
        return {};
    }

    return {
        JWT_ACCESS_TOKEN_TIME: env.JWT_ACCESS_TOKEN_TIME,
        JWT_REFRESH_TOKEN_TIME: env.JWT_REFRESH_TOKEN_TIME,
        MODE: env.MODE,
        AWS_IMAGE_BASEURL: env.AWS_IMAGE_BASEURL,
        SLACK_TOKEN: env.SLACK_TOKEN,
        MONGODB_URI: env.MONGODB_URI,
        JWT_SECRET_KEY: env.JWT_SECRET_KEY,
        INTERATIONS: env.INTERATIONS,
        DKLEN: env.DKLEN,
        HASH: env.HASH,
    };
};

export const GlobalConfigModule = ConfigModule.forRoot(
    process.env.NODE_ENV === 'development'
        ? {
              cache: true,
              isGlobal: true,
              envFilePath: `${process.cwd()}/apps/crawl-admin/.env.${process.env.NODE_ENV}`,
              load: [configs],
          }
        : {
              cache: true,
              isGlobal: true,
              load: [configs],
          },
);
