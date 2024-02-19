import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IShareComment } from '@private-crawl/types';
import { getCurrentDate } from '@private-crawl/utils';
import { Document, SchemaTypes } from 'mongoose';

import { SharePost } from './sharePost.schema';
import { User } from './user.schema';
import { getViewFields } from './utils/getViewFields';

export interface ShareCommentDocument extends ShareComment, Document {
    Mapper(): Omit<IShareComment, '_id'>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class ShareComment {
    @Prop({ index: true, ref: 'SharePost', type: SchemaTypes.ObjectId })
    postId: SharePost;

    @Prop({ index: true, ref: 'User', type: SchemaTypes.ObjectId })
    userId: User;

    @Prop({ required: true, type: SchemaTypes.String })
    contents: string;

    @Prop({ default: false, type: SchemaTypes.Boolean })
    isDeleted: boolean;
}

const ShareCommentSchema = SchemaFactory.createForClass(ShareComment);
ShareCommentSchema.index({ userId: 1, _id: 1 });
ShareCommentSchema.methods = {
    Mapper() {
        return getViewFields<Omit<IShareComment, '_id'>>(this, [
            'id',
            'postId',
            'userId',
            'contents',
            'isDeleted',
            'createdAt',
            'updatedAt',
        ]);
    },
};

export { ShareCommentSchema };
