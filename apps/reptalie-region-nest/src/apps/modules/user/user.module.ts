import { Module } from '@nestjs/common';

import { MongooseModuleFollow, MongooseModuleUser } from '../../utils/customModules';
import { AuthModule } from '../auth/auth.module';
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
    imports: [AuthModule, MongooseModuleUser, MongooseModuleFollow],
    controllers: [UserController],
    providers: [
        UserRepository,
        FollowRepository,
        UserSearcherServiceProvider,
        UserWriterServiceProvicer,
        UserUpdaterServiceProvider,
        UserDeleterServiceProvider,
    ],
    exports: [
        UserRepository,
        UserSearcherServiceProvider,
        UserWriterServiceProvicer,
        UserUpdaterServiceProvider,
        UserDeleterServiceProvider,
    ],
})
export class UserModule {}
