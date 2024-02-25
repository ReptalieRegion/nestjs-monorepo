import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import mongoose from 'mongoose';

import { AppController } from './app.controller';
import { GlobalConfigModule } from './global/modules/config.module';
import { GlobalMongooseModule } from './global/modules/mongoose.module';
import { GlobalSlackModule } from './global/modules/slack.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
    imports: [GlobalConfigModule, GlobalMongooseModule, GlobalSlackModule, AuthModule, AdminModule, UserModule],
    controllers: [AppController],
})
export class AppModule implements NestModule {
    private readonly isDev: boolean = process.env.MODE === 'dev';

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
        mongoose.set('debug', this.isDev);
    }
}
