import { Provider } from '@nestjs/common';
import { MockService, MockServiceToken } from './mock.service';

export const MockServiceProvider: Provider = {
    provide: MockServiceToken,
    useClass: MockService,
};
