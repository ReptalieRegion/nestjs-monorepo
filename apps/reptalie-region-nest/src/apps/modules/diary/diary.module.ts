import { Module, forwardRef } from '@nestjs/common';
import { MongooseModuleDiaryCalendar, MongooseModuleDiaryEntity, MongooseModuleDiaryWeight } from '../../utils/customModules';
import { AuthModule } from '../auth/auth.module';
import { ImageModule } from '../image/image.module';
import { NotificationModule } from '../notification/notification.module';
import { UserModule } from '../user/user.module';
import { DiaryController } from './diary.controller';
import {
    DiaryDeleterServiceProvider,
    DiarySearcherServiceProvider,
    DiaryUpdaterServiceProvider,
    DiaryWriterServiceProvider,
} from './diary.provider';
import { DiaryCalendarRepository } from './repository/diaryCalendar.repository';
import { DiaryEntityRepository } from './repository/diaryEntity.repository';
import { DiaryWeightRepository } from './repository/diaryWeight.repository';

@Module({
    imports: [
        MongooseModuleDiaryEntity,
        MongooseModuleDiaryWeight,
        MongooseModuleDiaryCalendar,
        forwardRef(() => AuthModule),
        forwardRef(() => UserModule),
        ImageModule,
        NotificationModule,
    ],
    controllers: [DiaryController],
    providers: [
        DiaryEntityRepository,
        DiaryWeightRepository,
        DiaryCalendarRepository,
        DiaryWriterServiceProvider,
        DiaryDeleterServiceProvider,
        DiaryUpdaterServiceProvider,
        DiarySearcherServiceProvider,
    ],
    exports: [
        DiaryWriterServiceProvider,
        DiaryDeleterServiceProvider,
        DiaryUpdaterServiceProvider,
        DiarySearcherServiceProvider,
    ],
})
export class DiaryModule {}
