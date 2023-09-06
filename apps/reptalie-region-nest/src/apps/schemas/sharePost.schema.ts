import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { Document, SchemaTypes } from 'mongoose';
import { IResponseSharePostDTO } from '../dto/share/post/response-sharePost.dto';
import { getCurrentDate } from '../utils/time/time';
import { User } from './user.schema';

export interface SharePostDocument extends SharePost, Document {
    view(): Partial<IResponseSharePostDTO>;
    Mapper(): Partial<IResponseSharePostDTO>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class SharePost {
    @Prop({ required: true, type: SchemaTypes.String })
    contents: string;

    @Prop({ ref: 'User', type: SchemaTypes.ObjectId })
    userId: User;

    @Prop({ default: false, type: SchemaTypes.Boolean })
    isDeleted: boolean;
}

const SharePostSchema = SchemaFactory.createForClass(SharePost);
SharePostSchema.index({ userId: 1 });
SharePostSchema.methods = {
    view(): Partial<IResponseSharePostDTO> {
        const fields: Array<keyof IResponseSharePostDTO> = ['id', 'contents', 'userId', 'isDeleted', 'createdAt', 'updatedAt'];

        const viewFields = fields.reduce(
            (prev, field) => ({
                ...prev,
                [field]: this.get(field),
            }),
            {},
        );

        return viewFields;
    },

    Mapper(): Partial<IResponseSharePostDTO> {
        const fields: Array<keyof IResponseSharePostDTO> = ['id', 'contents', 'userId', 'isDeleted', 'createdAt', 'updatedAt'];

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

export { SharePostSchema };
