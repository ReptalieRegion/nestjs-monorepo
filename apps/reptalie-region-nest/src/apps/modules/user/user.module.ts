import { Module } from '@nestjs/common';

import { MongooseModuleUser } from '../../utils/customModules';
import { AuthModule } from '../auth/auth.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
    imports: [AuthModule, MongooseModuleUser],
    controllers: [UserController],
    providers: [UserService, UserRepository],
    exports: [UserService, UserRepository],
})
export class UserModule {}
