import { AppleService, AppleServiceToken } from './service/apple.service';
import { AuthService, AuthServiceToken } from './service/auth.service';
import { CryptoService, CryptoServiceToken } from './service/crypto.service';
import { GoogleService, GoogleServiceToken } from './service/google.service';
import { KakaoService, KakaoServiceToken } from './service/kakao.service';
import { PBKDF2Service, PBKDF2ServiceToken } from './service/pbkdf2.service';

export const PBKDF2ServiceProvider = {
    provide: PBKDF2ServiceToken,
    useClass: PBKDF2Service,
};

export const CryptoServiceProvider = {
    provide: CryptoServiceToken,
    useClass: CryptoService,
};

export const AuthServiceProvider = {
    provide: AuthServiceToken,
    useClass: AuthService,
};

export const AppleServiceProvider = {
    provide: AppleServiceToken,
    useClass: AppleService,
};

export const KakaoServiceProvider = {
    provide: KakaoServiceToken,
    useClass: KakaoService,
};

export const GoogleServiceProvider = {
    provide: GoogleServiceToken,
    useClass: GoogleService,
};
