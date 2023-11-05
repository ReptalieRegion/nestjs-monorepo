import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CustomJwtModule, MongooseModuleSocial } from '../../utils/customModules';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import {
    AuthCommonServiceProvider,
    AuthEncryptServiceProvider,
    AuthSocialServiceProvider,
    AuthTokenServiceProvider,
} from './auth.provider';
import { SocialRepository } from './repository/social.repository';

@Module({
    imports: [MongooseModuleSocial, CustomJwtModule, PassportModule, forwardRef(() => UserModule)],
    controllers: [AuthController],
    providers: [
        SocialRepository,
        AuthCommonServiceProvider,
        AuthEncryptServiceProvider,
        AuthSocialServiceProvider,
        AuthTokenServiceProvider,
    ],
    exports: [AuthCommonServiceProvider, AuthEncryptServiceProvider, AuthSocialServiceProvider, AuthTokenServiceProvider],
})
export class AuthModule {}
