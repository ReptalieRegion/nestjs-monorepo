import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { Document, SchemaTypes } from 'mongoose';
import { IResponseShareLikeDTO } from '../dto/share/like/response-shareLike.dto';
import { getCurrentDate } from '../utils/time/time';
import { SharePost } from './sharePost.schema';
import { User } from './user.schema';

export interface ShareLikeDocument extends ShareLike, Document {
    view(): Partial<IResponseShareLikeDTO>;
    Mapper(): Partial<IResponseShareLikeDTO>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class ShareLike {
    @Prop({ index: true, ref: 'sharePost', type: SchemaTypes.ObjectId })
    postId: SharePost;

    @Prop({ ref: 'user', type: SchemaTypes.ObjectId })
    userId: User;

    @Prop({ default: false, type: SchemaTypes.Boolean })
    isCancled: boolean;
}

const ShareLikeSchema = SchemaFactory.createForClass(ShareLike);
ShareLikeSchema.index({ postId: 1, userId: 1 });
ShareLikeSchema.methods = {
    view(): Partial<IResponseShareLikeDTO> {
        const fields: Array<keyof IResponseShareLikeDTO> = ['id', 'postId', 'userId', 'isCancled', 'createdAt', 'updatedAt'];

        const viewFields = fields.reduce(
            (prev, field) => ({
                ...prev,
                [field]: this.get(field),
            }),
            {},
        );

        return viewFields;
    },

    Mapper(): Partial<IResponseShareLikeDTO> {
        const fields: Array<keyof IResponseShareLikeDTO> = ['id', 'postId', 'userId', 'isCancled', 'createdAt', 'updatedAt'];

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

export { ShareLikeSchema };
