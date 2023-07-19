import { MongooseModule } from '@nestjs/mongoose';
import { Image, ImageSchema } from '../../schemas/image.schema';
import { SharePost, SharePostSchema } from '../../schemas/sharePost.schema';
import { SharePostComment, SharePostCommentSchema } from '../../schemas/sharePostComment.schema';
import { SharePostLike, SharePostLikeSchema } from '../../schemas/sharePostLike.schema';
import { SharePostReplie, SharePostReplieSchema } from '../../schemas/sharePostReplie.schema';
import { User, userSchema } from '../../schemas/user.schema';

export const CustomMongooseModule = MongooseModule.forRoot(process.env.MONGODB_URI ?? '', {
    dbName: 'reptalie-region',
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

export const MongooseModuleUser = MongooseModule.forFeature([{ name: User.name, schema: userSchema }]);

export const MongooseModuleSharePost = MongooseModule.forFeature([{ name: SharePost.name, schema: SharePostSchema }]);

export const MongooseModuleImage = MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]);

export const MongooseModuleSharePostLike = MongooseModule.forFeature([
    { name: SharePostLike.name, schema: SharePostLikeSchema },
]);

export const MongooseModuleSharePostComment = MongooseModule.forFeature([
    { name: SharePostComment.name, schema: SharePostCommentSchema },
]);

export const MongooseModuleSharePostReplie = MongooseModule.forFeature([
    { name: SharePostReplie.name, schema: SharePostReplieSchema },
]);
