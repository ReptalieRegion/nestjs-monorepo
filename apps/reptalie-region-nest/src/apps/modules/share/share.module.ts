import { Module } from '@nestjs/common';
import {
    MongooseModuleSharePost,
    MongooseModuleSharePostComment,
    MongooseModuleSharePostLike,
    MongooseModuleSharePostReplie,
} from '../../utils/customModules';

import { ImageModule } from '../image/image.module';
import { UserModule } from '../user/user.module';
import { SharePostRepository } from './repository/sharePost.repository';
import { ShareController } from './share.controller';
import { ShareWriterServiceProvider } from './share.providers';

@Module({
    imports: [
        UserModule,
        ImageModule,
        MongooseModuleSharePost,
        MongooseModuleSharePostComment,
        MongooseModuleSharePostLike,
        MongooseModuleSharePostReplie,
    ],
    controllers: [ShareController],
    providers: [SharePostRepository, ShareWriterServiceProvider],
    exports: [],
})
export class ShareModule {}
