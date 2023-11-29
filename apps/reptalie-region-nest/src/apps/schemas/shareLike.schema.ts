import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { Document, SchemaTypes } from 'mongoose';
import { IResponseShareLikeDTO } from '../dto/share/like/response-shareLike.dto';
import { getCurrentDate } from '../utils/time/time';
import { SharePost } from './sharePost.schema';
import { User } from './user.schema';

export interface ShareLikeDocument extends ShareLike, Document {
    Mapper(): Partial<IResponseShareLikeDTO>;
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
    Mapper(): Partial<IResponseShareLikeDTO> {
        const fields: Array<keyof IResponseShareLikeDTO> = ['id', 'postId', 'userId', 'isCanceled', 'createdAt', 'updatedAt'];

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
