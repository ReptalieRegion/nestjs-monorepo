import { Module, forwardRef } from '@nestjs/common';
import { MongooseModuleDiaryEntity } from '../../utils/customModules';
import { AuthModule } from '../auth/auth.module';
import { ImageModule } from '../image/image.module';
import { UserModule } from '../user/user.module';
import { DiaryController } from './diary.controller';
import {
    DiaryDeleterServiceProvider,
    DiarySearcherServiceProvider,
    DiaryUpdaterServiceProvider,
    DiaryWriterServiceProvider,
} from './diary.provider';
import { DiaryEntityRepository } from './repository/diaryEntity.repository';

@Module({
    imports: [MongooseModuleDiaryEntity, forwardRef(() => AuthModule), forwardRef(() => UserModule), ImageModule],
    controllers: [DiaryController],
    providers: [
        DiaryEntityRepository,
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
