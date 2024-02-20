import { Provider } from '@nestjs/common';
import { CryptoService, CryptoServiceToken } from './crypto.service';

export const CryptoServiceProvider: Provider = {
    provide: CryptoServiceToken,
    useClass: CryptoService,
};
