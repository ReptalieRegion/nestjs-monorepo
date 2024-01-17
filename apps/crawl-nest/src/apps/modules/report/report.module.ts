import { Module, forwardRef } from '@nestjs/common';

import { MongooseModuleReportShareContent, MongooseModuleReportUserBlocking } from '../../utils/customModules';
import { AuthModule } from '../auth/auth.module';
import { ShareModule } from '../share/share.module';
import { UserModule } from '../user/user.module';
import { ReportController } from './report.controller';
import { ReportDeleterServiceProvider, ReportSearcherServiceProvider, ReportWriterServiceProvider } from './report.providers';
import { ReportShareContentRepository } from './repository/reportShareContent.repository';
import { ReportUserBlockingRepository } from './repository/reportUserBlocking.repository';

@Module({
    imports: [
        MongooseModuleReportShareContent,
        MongooseModuleReportUserBlocking,
        forwardRef(() => AuthModule),
        forwardRef(() => UserModule),
        forwardRef(() => ShareModule),
    ],
    controllers: [ReportController],
    providers: [
        ReportUserBlockingRepository,
        ReportShareContentRepository,
        ReportWriterServiceProvider,
        ReportSearcherServiceProvider,
        ReportDeleterServiceProvider,
    ],
    exports: [ReportWriterServiceProvider, ReportSearcherServiceProvider, ReportDeleterServiceProvider],
})
export class ReportModule {}
