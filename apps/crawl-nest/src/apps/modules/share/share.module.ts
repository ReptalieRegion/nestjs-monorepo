import { Module, forwardRef } from '@nestjs/common';
import {
    MongooseModuleShareComment,
    MongooseModuleShareCommentReply,
    MongooseModuleShareLike,
    MongooseModuleSharePost,
} from '../../utils/customModules';

import { AuthModule } from '../auth/auth.module';
import { ImageModule } from '../image/image.module';
import { NotificationModule } from '../notification/notification.module';
import { ReportModule } from '../report/report.module';
import { UserModule } from '../user/user.module';
import { UserActivityLogModule } from '../user-activity-log/userActivityLog.module';
import { ShareCommentRepository } from './repository/shareComment.repository';
import { ShareCommentReplyRepository } from './repository/shareCommentReply.repository';
import { ShareLikeRepository } from './repository/shareLike.repository';
import { SharePostRepository } from './repository/sharePost.repository';
import { ShareController } from './share.controller';
import {
    ShareDeleterServiceProvider,
    ShareSearcherServiceProvider,
    ShareUpdaterServiceProvider,
    ShareWriterServiceProvider,
} from './share.providers';

@Module({
    imports: [
        MongooseModuleSharePost,
        MongooseModuleShareComment,
        MongooseModuleShareCommentReply,
        MongooseModuleShareLike,
        UserActivityLogModule,
        ImageModule,
        forwardRef(() => AuthModule),
        forwardRef(() => UserModule),
        forwardRef(() => ReportModule),
        forwardRef(() => NotificationModule),
    ],
    controllers: [ShareController],
    providers: [
        SharePostRepository,
        ShareCommentRepository,
        ShareCommentReplyRepository,
        ShareLikeRepository,
        ShareWriterServiceProvider,
        ShareSearcherServiceProvider,
        ShareUpdaterServiceProvider,
        ShareDeleterServiceProvider,
    ],
    exports: [
        ShareWriterServiceProvider,
        ShareSearcherServiceProvider,
        ShareUpdaterServiceProvider,
        ShareDeleterServiceProvider,
    ],
})
export class ShareModule {}
