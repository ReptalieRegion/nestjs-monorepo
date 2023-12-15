import { Module, forwardRef } from '@nestjs/common';

import { MongooseModuleReport } from '../../utils/customModules';
import { AuthModule } from '../auth/auth.module';
import { ShareModule } from '../share/share.module';
import { UserModule } from '../user/user.module';
import { ReportController } from './report.controller';
import { ReportSearcherServiceProvider, ReportWriterServiceProvider } from './report.providers';
import { ReportRepository } from './repository/report.repository';

@Module({
    imports: [MongooseModuleReport, forwardRef(() => AuthModule), forwardRef(() => UserModule), ShareModule],
    controllers: [ReportController],
    providers: [ReportRepository, ReportWriterServiceProvider, ReportSearcherServiceProvider],
    exports: [ReportWriterServiceProvider, ReportSearcherServiceProvider],
})
export class ReportModule {}
