import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { Document, SchemaTypes } from 'mongoose';
import { IResponseShareCommentDTO } from '../dto/share/comment/response-shareCommnet.dto';
import { getCurrentDate } from '../utils/time/time';
import { SharePost } from './sharePost.schema';
import { User } from './user.schema';

export interface ShareCommentDocument extends ShareComment, Document {
    view(): Partial<IResponseShareCommentDTO>;
    Mapper(): Partial<IResponseShareCommentDTO>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class ShareComment {
    @Prop({ index: true, ref: 'sharePost', type: SchemaTypes.ObjectId })
    postId: SharePost;

    @Prop({ index: true, ref: 'User', type: SchemaTypes.ObjectId })
    userId: User;

    @Prop({ required: true, type: SchemaTypes.String })
    contents: string;

    @Prop({ default: 0, type: SchemaTypes.Number })
    replyCount: number;

    @Prop({ default: false, type: SchemaTypes.Boolean })
    isDeleted: boolean;
}

const ShareCommentSchema = SchemaFactory.createForClass(ShareComment);
ShareCommentSchema.index({ userId: 1, _id: 1 });
ShareCommentSchema.methods = {
    view(): Partial<IResponseShareCommentDTO> {
        const fields: Array<keyof IResponseShareCommentDTO> = [
            'id',
            'postId',
            'userId',
            'contents',
            'replyCount',
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

    Mapper(): Partial<IResponseShareCommentDTO> {
        const fields: Array<keyof IResponseShareCommentDTO> = [
            'id',
            'postId',
            'userId',
            'contents',
            'replyCount',
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

export { ShareCommentSchema };