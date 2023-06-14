import { Module } from '@nestjs/common';

import { MongooseModuleUser } from '../../utils/customModules';
import { AuthModule } from '../auth/auth.module';
import { UserService } from './service/user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';

@Module({
    imports: [AuthModule, MongooseModuleUser],
    controllers: [UserController],
    providers: [UserService, UserRepository],
    exports: [UserService, UserRepository],
})
export class UserModule {}
