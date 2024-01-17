import { ReportDeleterService, ReportDeleterServiceToken } from './service/reportDeleter.service';
import { ReportSearcherService, ReportSearcherServiceToken } from './service/reportSearcher.service';
import { ReportWriterService, ReportWriterServiceToken } from './service/reportWriter.service';

export const ReportWriterServiceProvider = {
    provide: ReportWriterServiceToken,
    useClass: ReportWriterService,
};

export const ReportSearcherServiceProvider = {
    provide: ReportSearcherServiceToken,
    useClass: ReportSearcherService,
};

export const ReportDeleterServiceProvider = {
    provide: ReportDeleterServiceToken,
    useClass: ReportDeleterService,
};
