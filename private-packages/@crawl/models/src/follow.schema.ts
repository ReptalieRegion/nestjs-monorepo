import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IFollow } from '@private-crawl/types';
import { getCurrentDate } from '@private-crawl/utils';
import { Document, SchemaTypes } from 'mongoose';

import { User } from './user.schema';
import { getViewFields } from './utils/getViewFields';

export interface FollowDocument extends Follow, Document {
    Mapper(): Omit<IFollow, '_id'>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class Follow {
    @Prop({ index: true, ref: 'User', type: SchemaTypes.ObjectId })
    following: User;

    @Prop({ index: true, ref: 'User', type: SchemaTypes.ObjectId })
    follower: User;

    @Prop({ required: true, type: SchemaTypes.String })
    followerNickname: string;

    @Prop({ required: true, type: SchemaTypes.String })
    initials: string;

    @Prop({ default: false, type: SchemaTypes.Boolean })
    isCanceled: boolean;
}

const FollowSchema = SchemaFactory.createForClass(Follow);
FollowSchema.index({ following: 1, follower: 1 }, { unique: true });
FollowSchema.methods = {
    Mapper() {
        return getViewFields<Omit<IFollow, '_id'>>(this, [
            'id',
            'following',
            'follower',
            'followerNickname',
            'initials',
            'isCanceled',
            'createdAt',
            'updatedAt',
        ]);
    },
};

export { FollowSchema };
