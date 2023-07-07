import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, SchemaTypes } from 'mongoose';
import { IResponseSharePostCommentDTO } from '../dto/sharePostComment/response-sharePostCommnet.dto';
import { getCurrentDate } from '../utils/time/time';
import { SharePost } from './sharePost.schema';
import { User } from './user.schema';

export interface SharePostCommentDocument extends SharePostComment, Document {
    view(): Partial<IResponseSharePostCommentDTO>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class SharePostComment {
    @Prop({ ref: 'sharePost', type: SchemaTypes.ObjectId })
    sharePostId: SharePost;

    @Prop({ ref: 'user', type: SchemaTypes.ObjectId })
    userId: User;

    @Prop({ required: true, type: SchemaTypes.String })
    content: string;

    @Prop({ ref: 'user', type: SchemaTypes.ObjectId })
    tagId: User;

    @Prop({ default: false, type: SchemaTypes.Boolean })
    isReplieExist: boolean;

    @Prop({ default: false, type: SchemaTypes.Boolean })
    isDeleted: boolean;
}

const SharePostCommentSchema = SchemaFactory.createForClass(SharePostComment);
SharePostCommentSchema.index({ sharePostId: 1 });
SharePostCommentSchema.methods = {
    view(): Partial<IResponseSharePostCommentDTO> {
        const fields: Array<keyof IResponseSharePostCommentDTO> = ['id', 'sharePostId', 'userId', 'tagId', 'content'];

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

export { SharePostCommentSchema };
