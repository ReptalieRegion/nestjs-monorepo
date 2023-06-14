import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, SchemaTypes } from 'mongoose';
import { IResponseSharePostDTO } from '../dto/sharePost/response-sharePost.dto';
import { User } from './user.schema';

export interface SharePostDocument extends SharePost, Document {
    view(): Partial<IResponseSharePostDTO>;
}

@Schema({ versionKey: false })
export class SharePost {
    @Prop({ required: true, type: SchemaTypes.String })
    content: string;

    @Prop({ ref: 'user', type: SchemaTypes.ObjectId })
    userId: User;

    @Prop({ default: false, type: SchemaTypes.Boolean })
    isDeleted: boolean;
}

const SharePostSchema = SchemaFactory.createForClass(SharePost);
SharePostSchema.set('timestamps', true);
SharePostSchema.index({ userId: 1 });
SharePostSchema.methods = {
    view(): Partial<IResponseSharePostDTO> {
        const fields: Array<keyof IResponseSharePostDTO> = ['id', 'content', 'userId'];

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

export { SharePostSchema };
