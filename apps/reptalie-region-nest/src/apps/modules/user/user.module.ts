import { Module, forwardRef } from '@nestjs/common';

import { MongooseModuleFollow, MongooseModuleUser } from '../../utils/customModules';
import { AuthModule } from '../auth/auth.module';
import { ImageModule } from '../image/image.module';
import { ShareModule } from '../share/share.module';
import { FollowRepository } from './repository/follow.repository';
import { UserRepository } from './repository/user.repository';
import { UserController } from './user.controller';
import {
    UserDeleterServiceProvider,
    UserSearcherServiceProvider,
    UserUpdaterServiceProvider,
    UserWriterServiceProvicer,
} from './user.providers';

@Module({
    imports: [
        forwardRef(() => ShareModule),
        forwardRef(() => AuthModule),
        ImageModule,
        MongooseModuleUser,
        MongooseModuleFollow,
    ],
    controllers: [UserController],
    providers: [
        UserRepository,
        FollowRepository,
        UserSearcherServiceProvider,
        UserWriterServiceProvicer,
        UserUpdaterServiceProvider,
        UserDeleterServiceProvider,
    ],
    exports: [UserSearcherServiceProvider, UserWriterServiceProvicer, UserUpdaterServiceProvider, UserDeleterServiceProvider],
})
export class UserModule {}
