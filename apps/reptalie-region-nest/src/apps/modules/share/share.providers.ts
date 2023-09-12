import { ShareDeleterService, ShareDeleterServiceToken } from './service/shareDeleter.service';
import { ShareSearcherService, ShareSearcherServiceToken } from './service/shareSearcher.service';
import { ShareUpdaterService, ShareUpdaterServiceToken } from './service/shareUpdater.service';
import { ShareWriterService, ShareWriterServiceToken } from './service/shareWriter.service';

export const ShareWriterServiceProvider = {
    provide: ShareWriterServiceToken,
    useClass: ShareWriterService,
};

export const ShareSearcherServiceProvider = {
    provide: ShareSearcherServiceToken,
    useClass: ShareSearcherService,
};

export const ShareUpdaterServiceProvider = {
    provide: ShareUpdaterServiceToken,
    useClass: ShareUpdaterService,
};

export const ShareDeleterServiceProvider = {
    provide: ShareDeleterServiceToken,
    useClass: ShareDeleterService,
};
