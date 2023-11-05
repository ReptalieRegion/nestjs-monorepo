import { AuthCommonService, AuthCommonServiceToken } from './service/authCommon.service';
import { AuthEncryptService, AuthEncryptServiceToken } from './service/authEncrypt.service';
import { AuthSocialService, AuthSocialServiceToken } from './service/authSocial.service';
import { AuthTokenService, AuthTokenServiceToken } from './service/authToken.service';

export const AuthCommonServiceProvider = {
    provide: AuthCommonServiceToken,
    useClass: AuthCommonService,
};

export const AuthEncryptServiceProvider = {
    provide: AuthEncryptServiceToken,
    useClass: AuthEncryptService,
};

export const AuthSocialServiceProvider = {
    provide: AuthSocialServiceToken,
    useClass: AuthSocialService,
};

export const AuthTokenServiceProvider = {
    provide: AuthTokenServiceToken,
    useClass: AuthTokenService,
};
