import { Module } from '@nestjs/common';
import { MongooseModuleAdmin } from '../../global/modules';
import { AdminServiceProvider } from './admin.provider';

@Module({
    imports: [MongooseModuleAdmin],
    providers: [AdminServiceProvider],
    exports: [AdminServiceProvider],
})
export class AdminModule {}
