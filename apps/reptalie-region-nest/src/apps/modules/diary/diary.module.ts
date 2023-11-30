import { Module } from '@nestjs/common';
import { MongooseModuleDiaryEntity } from '../../utils/customModules';
import { DiaryController } from './diary.controller';
import {
    DiaryDeleterServiceProvider,
    DiarySearcherServiceProvider,
    DiaryUpdaterServiceProvider,
    DiaryWriterServiceProvider,
} from './diary.provider';
import { DiaryEntityRepository } from './repository/diaryEntity.repository';

@Module({
    imports: [MongooseModuleDiaryEntity],
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
