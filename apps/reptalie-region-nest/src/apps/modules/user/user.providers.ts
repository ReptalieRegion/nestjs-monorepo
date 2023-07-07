import { UserSearcherService, UserSearcherServiceToken } from "./service/userSearcher.service";

export const UserSearcherServiceProvider = {
    provide: UserSearcherServiceToken,
    useClass: UserSearcherService
}

