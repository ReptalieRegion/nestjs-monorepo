import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CustomJwtModule, MongooseModuleSocial, MongooseModuleTempUser } from '../../utils/customModules';
import { DiaryModule } from '../diary/diary.module';
import { ImageModule } from '../image/image.module';
import { NotificationModule } from '../notification/notification.module';
import { ReportModule } from '../report/report.module';
import { ShareModule } from '../share/share.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import {
    AuthCommonServiceProvider,
    AuthEncryptServiceProvider,
    AuthSocialServiceProvider,
    AuthTokenServiceProvider,
} from './auth.provider';
import { SocialRepository } from './repository/social.repository';
import { TempUserRepository } from './repository/tempUser.repository';

@Module({
    imports: [
        MongooseModuleSocial,
        MongooseModuleTempUser,
        CustomJwtModule,
        PassportModule,
        ImageModule,
        NotificationModule,
        forwardRef(() => UserModule),
        forwardRef(() => ShareModule),
        forwardRef(() => DiaryModule),
        forwardRef(() => NotificationModule),
        forwardRef(() => ReportModule),
    ],
    controllers: [AuthController],
    providers: [
        SocialRepository,
        TempUserRepository,
        AuthCommonServiceProvider,
        AuthEncryptServiceProvider,
        AuthSocialServiceProvider,
        AuthTokenServiceProvider,
    ],
    exports: [AuthCommonServiceProvider, AuthEncryptServiceProvider, AuthSocialServiceProvider, AuthTokenServiceProvider],
})
export class AuthModule {}
