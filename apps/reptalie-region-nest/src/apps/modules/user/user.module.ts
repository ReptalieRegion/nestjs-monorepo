import { Module } from '@nestjs/common';

import { MongooseModuleUser } from '../../utils/customModules';
import { AuthModule } from '../auth/auth.module';
import { UserController } from './user.controller';
import { UserSearcherServiceProvider } from './user.providers';
import { UserRepository } from './user.repository';

@Module({
    imports: [AuthModule, MongooseModuleUser],
    controllers: [UserController],
    providers: [UserRepository, UserSearcherServiceProvider],
    exports: [UserRepository, UserSearcherServiceProvider],
})
export class UserModule {}
