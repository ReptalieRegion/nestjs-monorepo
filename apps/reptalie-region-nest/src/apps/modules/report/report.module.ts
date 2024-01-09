import { Module, forwardRef } from '@nestjs/common';

import { MongooseModuleReport } from '../../utils/customModules';
import { AuthModule } from '../auth/auth.module';
import { ShareModule } from '../share/share.module';
import { UserModule } from '../user/user.module';
import { ReportController } from './report.controller';
import { ReportDeleterServiceProvider, ReportSearcherServiceProvider, ReportWriterServiceProvider } from './report.providers';
import { ReportRepository } from './repository/report.repository';

@Module({
    imports: [MongooseModuleReport, forwardRef(() => AuthModule), forwardRef(() => UserModule), forwardRef(() => ShareModule)],
    controllers: [ReportController],
    providers: [ReportRepository, ReportWriterServiceProvider, ReportSearcherServiceProvider, ReportDeleterServiceProvider],
    exports: [ReportWriterServiceProvider, ReportSearcherServiceProvider, ReportDeleterServiceProvider],
})
export class ReportModule {}