import { Module } from '@nestjs/common';
import {
    MongooseModuleSharePost,
    MongooseModuleSharePostComment,
    MongooseModuleSharePostLike,
    MongooseModuleSharePostReplie,
} from '../../utils/customModules';

import { ImageModule } from '../image/image.module';
import { SharePostRepository } from './repository/sharePost.repository';
import { ShareService } from './service/share.service';
import { ShareController } from './share.controller';

@Module({
    imports: [
        ImageModule,
        MongooseModuleSharePost,
        MongooseModuleSharePostComment,
        MongooseModuleSharePostLike,
        MongooseModuleSharePostReplie,
    ],
    controllers: [ShareController],
    providers: [SharePostRepository, ShareService],
    exports: [],
})
export class ShareModule {}
