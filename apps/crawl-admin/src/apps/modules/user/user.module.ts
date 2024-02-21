import { Module } from '@nestjs/common';
import { MongooseModuleUser } from '../../global/modules';
import { AdminModule } from '../admin/admin.module';
import { AuthModule } from '../auth/auth.module';
import { UserController } from './user.controller';
import { UserServiceProvider } from './user.provider';

@Module({
    imports: [AdminModule, AuthModule, MongooseModuleUser],
    controllers: [UserController],
    providers: [UserServiceProvider],
    exports: [UserServiceProvider],
})
export class UserModule {}
