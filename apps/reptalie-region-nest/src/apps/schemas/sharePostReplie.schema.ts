import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, SchemaTypes } from 'mongoose';
import { IResponseSharePostReplieDTO } from '../dto/sharePostReplie/response-sharePostReplie.dto';
import { getCurrentDate } from '../utils/time/time';
import { SharePostComment } from './sharePostComment.schema';
import { User } from './user.schema';

export interface SharePostReplieDocument extends SharePostReplie, Document {
    view(): Partial<IResponseSharePostReplieDTO>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class SharePostReplie {
    @Prop({ ref: 'sharePostComment', type: SchemaTypes.ObjectId })
    sharePostCommentId: SharePostComment;

    @Prop({ ref: 'user', type: SchemaTypes.ObjectId })
    userId: User;

    @Prop({ required: true, type: SchemaTypes.String })
    content: string;

    @Prop({ ref: 'user', type: SchemaTypes.ObjectId })
    tagId: User;

    @Prop({ default: false, type: SchemaTypes.Boolean })
    isDeleted: boolean;
}

const SharePostReplieSchema = SchemaFactory.createForClass(SharePostComment);
SharePostReplieSchema.index({ sharePostCommentId: 1 });
SharePostReplieSchema.methods = {
    view(): Partial<IResponseSharePostReplieDTO> {
        const fields: Array<keyof IResponseSharePostReplieDTO> = ['id', 'sharePostCommentId', 'userId', 'content', 'tagId'];

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

export { SharePostReplieSchema };
