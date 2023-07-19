import { Module } from '@nestjs/common';

import { MongooseModuleUser } from '../../utils/customModules';
import { AuthModule } from '../auth/auth.module';
import { UserService } from './service/user.service';
import { UserController } from './user.controller';
import { UserSearcherServiceProvider } from './user.providers';
import { UserRepository } from './user.repository';

@Module({
    imports: [AuthModule, MongooseModuleUser],
    controllers: [UserController],
    providers: [UserService, UserRepository, UserSearcherServiceProvider],
    exports: [UserService, UserRepository, UserSearcherServiceProvider],
})
export class UserModule {}
