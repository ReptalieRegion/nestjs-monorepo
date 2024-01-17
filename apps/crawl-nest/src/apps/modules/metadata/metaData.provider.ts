import { MetaDataDeleterService, MetaDataDeleterServiceToken } from './service/metaDataDeleter.service';
import { MetaDataSearcherService, MetaDataSearcherServiceToken } from './service/metaDataSearcher.service';
import { MetaDataUpdaterService, MetaDataUpdaterServiceToken } from './service/metaDataUpdater.service';
import { MetaDataWriterService, MetaDataWriterServiceToken } from './service/metaDataWriter.service';

export const MetaDataWriterServiceProvider = {
    provide: MetaDataWriterServiceToken,
    useClass: MetaDataWriterService,
};

export const MetaDataSearcherServiceProvider = {
    provide: MetaDataSearcherServiceToken,
    useClass: MetaDataSearcherService,
};

export const MetaDataUpdaterServiceProvider = {
    provide: MetaDataUpdaterServiceToken,
    useClass: MetaDataUpdaterService,
};

export const MetaDataDeleterServiceProvider = {
    provide: MetaDataDeleterServiceToken,
    useClass: MetaDataDeleterService,
};
