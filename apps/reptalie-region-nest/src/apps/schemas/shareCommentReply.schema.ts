import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { Document, SchemaTypes } from 'mongoose';
import { IResponseShareCommentReplyDTO } from '../dto/share/commentReply/response-shareCommentReply.dto';
import { getCurrentDate } from '../utils/time/time';
import { ShareComment } from './shareComment.schema';
import { User } from './user.schema';

export interface ShareCommentReplyDocument extends ShareCommentReply, Document {
    view(): Partial<IResponseShareCommentReplyDTO>;
    Mapper(): Partial<IResponseShareCommentReplyDTO>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class ShareCommentReply {
    @Prop({ index: true, ref: 'shareComment', type: SchemaTypes.ObjectId })
    commentId: ShareComment;

    @Prop({ index: true, ref: 'user', type: SchemaTypes.ObjectId })
    userId: User;

    @Prop({ required: true, type: SchemaTypes.String })
    contents: string;

    @Prop({ default: false, type: SchemaTypes.Boolean })
    isDeleted: boolean;
}

const ShareCommentReplySchema = SchemaFactory.createForClass(ShareCommentReply);
ShareCommentReplySchema.index({ _id: 1, userId: 1 });
ShareCommentReplySchema.methods = {
    view(): Partial<IResponseShareCommentReplyDTO> {
        const fields: Array<keyof IResponseShareCommentReplyDTO> = [
            'id',
            'commentId',
            'userId',
            'contents',
            'isDeleted',
            'createdAt',
            'updatedAt',
        ];

        const viewFields = fields.reduce(
            (prev, field) => ({
                ...prev,
                [field]: this.get(field),
            }),
            {},
        );

        return viewFields;
    },

    Mapper(): Partial<IResponseShareCommentReplyDTO> {
        const fields: Array<keyof IResponseShareCommentReplyDTO> = [
            'id',
            'commentId',
            'userId',
            'contents',
            'isDeleted',
            'createdAt',
            'updatedAt',
        ];

        const viewFields = fields.reduce((prev, field) => {
            const value = this.get(field);

            if (value === undefined) {
                return prev;
            }

            if (value instanceof mongoose.Types.ObjectId) {
                return {
                    ...prev,
                    [field]: value.toHexString(),
                };
            }

            return {
                ...prev,
                [field]: value,
            };
        }, {});

        return viewFields;
    },
};

export { ShareCommentReplySchema };
