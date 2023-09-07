import { UserDeleterService, UserDeleterServiceToken } from './service/userDeleter.service';
import { UserSearcherService, UserSearcherServiceToken } from './service/userSearcher.service';
import { UserUpdaterService, UserUpdaterServiceToken } from './service/userUpdater.service';
import { UserWriterService, UserWriterServiceToken } from './service/userWriter.service';

export const UserSearcherServiceProvider = {
    provide: UserSearcherServiceToken,
    useClass: UserSearcherService,
};

export const UserWriterServiceProvicer = {
    provide: UserWriterServiceToken,
    useClass: UserWriterService,
};

export const UserUpdaterServiceProvider = {
    provide: UserUpdaterServiceToken,
    useClass: UserUpdaterService,
};

export const UserDeleterServiceProvider = {
    provide: UserDeleterServiceToken,
    useClass: UserDeleterService,
};
