import { Module } from '@nestjs/common';
import {
    MongooseModuleSharePost,
    MongooseModuleShareComment,
    MongooseModuleShareCommentReply,
    MongooseModuleShareLike,
} from '../../utils/customModules';

import { AuthModule } from '../auth/auth.module';
import { ImageModule } from '../image/image.module';
import { UserModule } from '../user/user.module';
import { ShareCommentRepository } from './repository/shareComment.repository';
import { ShareCommentReplyRepository } from './repository/shareCommentReply.repository';
import { ShareLikeRepository } from './repository/shareLike.repository';
import { SharePostRepository } from './repository/sharePost.repository';
import { ShareController } from './share.controller';
import {
    ShareWriterServiceProvider,
    ShareSearcherServiceProvider,
    ShareUpdaterServiceProvider,
    ShareDeleterServiceProvider,
} from './share.providers';

@Module({
    imports: [
        AuthModule,
        UserModule,
        ImageModule,
        MongooseModuleSharePost,
        MongooseModuleShareComment,
        MongooseModuleShareCommentReply,
        MongooseModuleShareLike,
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
    exports: [],
})
export class ShareModule {}
