import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IShareCommentReply } from '@private-crawl/types';
import { getCurrentDate } from '@private-crawl/utils';
import { Document, SchemaTypes } from 'mongoose';

import { ShareComment } from './shareComment.schema';
import { User } from './user.schema';
import { getViewFields } from './utils/getViewFields';

export interface ShareCommentReplyDocument extends ShareCommentReply, Document {
    Mapper(): Omit<IShareCommentReply, '_id'>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class ShareCommentReply {
    @Prop({ index: true, ref: 'ShareComment', type: SchemaTypes.ObjectId })
    commentId: ShareComment;

    @Prop({ index: true, ref: 'User', type: SchemaTypes.ObjectId })
    userId: User;

    @Prop({ required: true, type: SchemaTypes.String })
    contents: string;

    @Prop({ default: false, type: SchemaTypes.Boolean })
    isDeleted: boolean;
}

const ShareCommentReplySchema = SchemaFactory.createForClass(ShareCommentReply);
ShareCommentReplySchema.index({ _id: 1, userId: 1 });
ShareCommentReplySchema.methods = {
    Mapper() {
        return getViewFields<Omit<IShareCommentReply, '_id'>>(this, [
            'id',
            'commentId',
            'userId',
            'contents',
            'isDeleted',
            'createdAt',
            'updatedAt',
        ]);
    },
};

export { ShareCommentReplySchema };
