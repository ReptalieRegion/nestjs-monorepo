import { Module, forwardRef } from '@nestjs/common';
import { MongooseModuleDiaryEntity, MongooseModuleDiaryWeight } from '../../utils/customModules';
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
import { DiaryEntityRepository } from './repository/diaryEntity.repository';
import { DiaryWeightRepository } from './repository/diaryWeight.repository';

@Module({
    imports: [
        MongooseModuleDiaryEntity,
        MongooseModuleDiaryWeight,
        forwardRef(() => AuthModule),
        forwardRef(() => UserModule),
        ImageModule,
        NotificationModule,
    ],
    controllers: [DiaryController],
    providers: [
        DiaryEntityRepository,
        DiaryWeightRepository,
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
