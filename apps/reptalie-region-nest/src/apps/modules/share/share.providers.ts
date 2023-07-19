import { ShareWriterService, ShareWriterServiceToken } from './service/shareWriter.service';

export const ShareWriterServiceProvider = {
    provide: ShareWriterServiceToken,
    useClass: ShareWriterService,
};
