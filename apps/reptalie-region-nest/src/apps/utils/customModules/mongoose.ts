import { MongooseModule } from '@nestjs/mongoose';
import { Follow, FollowSchema } from '../../schemas/follow.schema';
import { Image, ImageSchema } from '../../schemas/image.schema';
import { ShareComment, ShareCommentSchema } from '../../schemas/shareComment.schema';
import { ShareCommentReply, ShareCommentReplySchema } from '../../schemas/shareCommentReply.schema';
import { ShareLike, ShareLikeSchema } from '../../schemas/shareLike.schema';
import { SharePost, SharePostSchema } from '../../schemas/sharePost.schema';
import { User, userSchema } from '../../schemas/user.schema';

export const CustomMongooseModule = MongooseModule.forRoot(process.env.MONGODB_URI ?? '', {
    dbName: 'reptalie-region',
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

export const MongooseModuleUser = MongooseModule.forFeature([{ name: User.name, schema: userSchema }]);

export const MongooseModuleSharePost = MongooseModule.forFeature([{ name: SharePost.name, schema: SharePostSchema }]);

export const MongooseModuleShareComment = MongooseModule.forFeature([{ name: ShareComment.name, schema: ShareCommentSchema }]);

export const MongooseModuleShareCommentReply = MongooseModule.forFeature([
    { name: ShareCommentReply.name, schema: ShareCommentReplySchema },
]);

export const MongooseModuleShareLike = MongooseModule.forFeature([{ name: ShareLike.name, schema: ShareLikeSchema }]);

export const MongooseModuleImage = MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]);

export const MongooseModuleFollow = MongooseModule.forFeature([{ name: Follow.name, schema: FollowSchema }]);
