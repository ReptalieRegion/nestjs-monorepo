import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { DiaryModule } from '../diary/diary.module';

import { MetaDataModule } from '../metadata/metaData.module';
import { NotificationModule } from '../notification/notification.module';
import { ReportModule } from '../report/report.module';
import { ShareModule } from '../share/share.module';
import { UserModule } from '../user/user.module';
import { MockController } from './mock.controller';
import { MockServiceProvider } from './mock.provider';

@Module({
    imports: [UserModule, AuthModule, ShareModule, NotificationModule, DiaryModule, ReportModule, MetaDataModule],
    controllers: [MockController],
    providers: [MockServiceProvider],
})
export class MockModule {}
