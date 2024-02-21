import { Module, forwardRef } from '@nestjs/common';
import { MongooseModuleAdmin } from '../../global/modules';
import { AuthModule } from '../auth/auth.module';
import { AdminController } from './admin.controller';
import { AdminServiceProvider } from './admin.provider';

@Module({
    imports: [MongooseModuleAdmin, forwardRef(() => AuthModule)],
    controllers: [AdminController],
    providers: [AdminServiceProvider],
    exports: [AdminServiceProvider],
})
export class AdminModule {}
