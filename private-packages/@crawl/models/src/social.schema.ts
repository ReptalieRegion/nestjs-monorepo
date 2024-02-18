import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ISocial, JoinProgressType, SocialProviderType } from '@private-crawl/types';
import { getCurrentDate } from '@private-crawl/utils';
import { Document, SchemaTypes } from 'mongoose';

import { User } from './user.schema';
import { getViewFields } from './utils/getViewFields';

export interface SocialDocument extends Social, Document {
    Mapper(): Omit<ISocial, '_id'>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class Social {
    @Prop({ required: true, index: true, ref: 'User', type: SchemaTypes.ObjectId })
    userId: User;

    @Prop({ required: true, enum: SocialProviderType })
    provider: SocialProviderType;

    @Prop({ required: true, type: SchemaTypes.String })
    uniqueId: string;

    @Prop({ required: true, enum: JoinProgressType })
    joinProgress: JoinProgressType;

    @Prop({ type: SchemaTypes.String, default: 'defaultValue' })
    salt: string;

    @Prop({ type: SchemaTypes.String, default: 'defaultValue' })
    refreshToken: string;
}

const socialSchema = SchemaFactory.createForClass(Social);
socialSchema.index({ provider: 1, uniqueId: 1 }, { unique: true });
socialSchema.methods = {
    Mapper() {
        return getViewFields<Omit<ISocial, '_id'>>(this, [
            'id',
            'userId',
            'provider',
            'uniqueId',
            'joinProgress',
            'salt',
            'refreshToken',
            'createdAt',
            'updatedAt',
        ]);
    },
};

export { socialSchema };
