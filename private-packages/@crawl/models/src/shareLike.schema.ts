import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IShareLike } from '@private-crawl/types';
import { getCurrentDate } from '@private-crawl/utils';
import { Document, SchemaTypes } from 'mongoose';

import { SharePost } from './sharePost.schema';
import { User } from './user.schema';
import { getViewFields } from './utils/getViewFields';

export interface ShareLikeDocument extends ShareLike, Document {
    Mapper(): Omit<IShareLike, '_id'>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class ShareLike {
    @Prop({ index: true, ref: 'SharePost', type: SchemaTypes.ObjectId })
    postId: SharePost;

    @Prop({ index: true, ref: 'User', type: SchemaTypes.ObjectId })
    userId: User;

    @Prop({ default: false, type: SchemaTypes.Boolean })
    isCanceled: boolean;
}

const ShareLikeSchema = SchemaFactory.createForClass(ShareLike);
ShareLikeSchema.index({ postId: 1, userId: 1 }, { unique: true });
ShareLikeSchema.methods = {
    Mapper() {
        return getViewFields<Omit<IShareLike, '_id'>>(this, ['id', 'postId', 'userId', 'isCanceled', 'createdAt', 'updatedAt']);
    },
};

export { ShareLikeSchema };
