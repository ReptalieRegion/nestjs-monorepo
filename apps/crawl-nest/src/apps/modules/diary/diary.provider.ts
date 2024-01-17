import { DiaryDeleterService, DiaryDeleterServiceToken } from './service/diaryDeleter.service';
import { DiarySearcherService, DiarySearcherServiceToken } from './service/diarySearcher.service';
import { DiaryUpdaterService, DiaryUpdaterServiceToken } from './service/diaryUpdater.service';
import { DiaryWriterService, DiaryWriterServiceToken } from './service/diaryWriter.service';

export const DiaryWriterServiceProvider = {
    provide: DiaryWriterServiceToken,
    useClass: DiaryWriterService,
};

export const DiarySearcherServiceProvider = {
    provide: DiarySearcherServiceToken,
    useClass: DiarySearcherService,
};

export const DiaryUpdaterServiceProvider = {
    provide: DiaryUpdaterServiceToken,
    useClass: DiaryUpdaterService,
};

export const DiaryDeleterServiceProvider = {
    provide: DiaryDeleterServiceToken,
    useClass: DiaryDeleterService,
};
