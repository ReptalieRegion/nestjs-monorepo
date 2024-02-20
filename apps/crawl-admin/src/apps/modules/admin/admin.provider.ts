import { Provider } from '@nestjs/common';
import { AdminService, AdminServiceToken } from './admin.service';

export const AdminServiceProvider: Provider = {
    provide: AdminServiceToken,
    useClass: AdminService,
};
