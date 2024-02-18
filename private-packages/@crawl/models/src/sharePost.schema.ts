import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ISharePost } from '@private-crawl/types';
import { getCurrentDate } from '@private-crawl/utils';
import { Document, SchemaTypes } from 'mongoose';

import { User } from './user.schema';
import { getViewFields } from './utils/getViewFields';

export interface SharePostDocument extends SharePost, Document {
    Mapper(): Omit<ISharePost, '_id'>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class SharePost {
    @Prop({ index: true, ref: 'User', type: SchemaTypes.ObjectId })
    userId: User;

    @Prop({ required: true, type: SchemaTypes.String })
    contents: string;

    @Prop({ default: false, type: SchemaTypes.Boolean })
    isDeleted: boolean;
}

const SharePostSchema = SchemaFactory.createForClass(SharePost);
SharePostSchema.methods = {
    Mapper() {
        return getViewFields<Omit<ISharePost, '_id'>>(this, [
            'id',
            'contents',
            'userId',
            'isDeleted',
            'createdAt',
            'updatedAt',
        ]);
    },
};

export { SharePostSchema };
