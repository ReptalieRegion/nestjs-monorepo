import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, SchemaTypes } from 'mongoose';
import { IResponseSharePostLikeDTO } from '../dto/sharePostLike/response-sharePostLike.dto';
import { getCurrentDate } from '../utils/time/time';
import { SharePost } from './sharePost.schema';
import { User } from './user.schema';

export interface SharePostLikeDocument extends SharePostLike, Document {
    view(): Partial<IResponseSharePostLikeDTO>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class SharePostLike {
    @Prop({ ref: 'sharePost', type: SchemaTypes.ObjectId })
    sharePostId: SharePost;

    @Prop({ ref: 'user', type: SchemaTypes.ObjectId })
    userId: User;

    @Prop({ default: false, type: SchemaTypes.Boolean })
    isCancled: boolean;
}

const SharePostLikeSchema = SchemaFactory.createForClass(SharePostLike);
SharePostLikeSchema.index({ sharePostId: 1 });
SharePostLikeSchema.methods = {
    view(): Partial<IResponseSharePostLikeDTO> {
        const fields: Array<keyof IResponseSharePostLikeDTO> = ['id', 'sharePostId', 'userId'];

        const viewFields = fields.reduce(
            (prev, field) => ({
                ...prev,
                [field]: this.get(field),
            }),
            {},
        );

        return viewFields;
    },
};

export { SharePostLikeSchema };
