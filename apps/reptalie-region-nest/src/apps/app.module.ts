import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import mongoose from 'mongoose';

import { LoggerMiddleware } from './middlwares/logger.middleware';
import { AuthController } from './modules/auth/auth.controller';
import { RedisModule } from './modules/redis/redis.module';
import { UserModule } from './modules/user/user.module';
import { CustomConfigModule } from './utils/customModules/config';
import { CustomJwtModule } from './utils/customModules/jwt';
import { CustomMongooseModule } from './utils/customModules/mongoose';

@Module({
    imports: [AuthController, UserModule, RedisModule, CustomJwtModule, CustomConfigModule, CustomMongooseModule],
    controllers: [],
    providers: [],
})
export class AppModule implements NestModule {
    private readonly isDev: boolean = process.env.MODE === 'dev';

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
        mongoose.set('debug', this.isDev);
    }
}