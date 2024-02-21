import { Provider } from '@nestjs/common';
import { UserService, UserServiceToken } from './user.service';

export const UserServiceProvider: Provider = {
    provide: UserServiceToken,
    useClass: UserService,
};
