import { Module } from '@nestjs/common';

@Module({
    imports: [MongooseModuleUser, MongooseModuleFollow],
    controllers: [UserController],
    providers: [
        UserRepository,
        FollowRepository,
        UserSearcherServiceProvider,
        UserWriterServiceProvider,
        UserUpdaterServiceProvider,
        UserDeleterServiceProvider,
    ],
    exports: [UserSearcherServiceProvider, UserWriterServiceProvider, UserUpdaterServiceProvider, UserDeleterServiceProvider],
})
export class UserModule {}
