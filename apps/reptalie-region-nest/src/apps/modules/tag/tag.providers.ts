import { TagSearcherService, TagSearcherServiceToken } from './service/tagSearcher.service';
import { TagWriterService, TagWriterServiceToken } from './service/tagWriter.service';

export const TagSearcherServiceProvider = {
    provide: TagSearcherServiceToken,
    useClass: TagSearcherService,
};

export const TagWriterServiceProvider = {
    provide: TagWriterServiceToken,
    useClass: TagWriterService,
};
