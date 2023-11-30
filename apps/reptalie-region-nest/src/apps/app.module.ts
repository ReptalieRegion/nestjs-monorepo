import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import mongoose from 'mongoose';

import { LoggerMiddleware } from './middlwares/logger.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { DiaryModule } from './modules/diary/diary.module';
import { MetaDataModule } from './modules/metadata/metaData.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ShareModule } from './modules/share/share.module';
import { UserModule } from './modules/user/user.module';
import { CustomConfigModule } from './utils/customModules/config';
import { CustomMongooseModule } from './utils/customModules/mongoose';

@Module({
    imports: [
        UserModule,
        AuthModule,
        ShareModule,
        NotificationModule,
        DiaryModule,
        MetaDataModule,
        CustomConfigModule,
        CustomMongooseModule,
    ],
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
