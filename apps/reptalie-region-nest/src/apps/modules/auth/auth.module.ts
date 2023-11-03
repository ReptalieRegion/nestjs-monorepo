import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CustomJwtModule, MongooseModuleSocial } from '../../utils/customModules';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import {
    AuthServiceProvider,
    PBKDF2ServiceProvider,
    AppleServiceProvider,
    GoogleServiceProvider,
    KakaoServiceProvider,
    CryptoServiceProvider,
} from './auth.provider';
import { SocialRepository } from './repository/social.repository';

@Module({
    imports: [MongooseModuleSocial, CustomJwtModule, PassportModule, forwardRef(() => UserModule)],
    controllers: [AuthController],
    providers: [
        SocialRepository,
        PBKDF2ServiceProvider,
        CryptoServiceProvider,
        AuthServiceProvider,
        AppleServiceProvider,
        GoogleServiceProvider,
        KakaoServiceProvider,
    ],
    exports: [
        PBKDF2ServiceProvider,
        CryptoServiceProvider,
        AuthServiceProvider,
        AppleServiceProvider,
        GoogleServiceProvider,
        KakaoServiceProvider,
    ],
})
export class AuthModule {}
