import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ITempUser, SocialProviderType } from '@private-crawl/types';
import { getCurrentDate } from '@private-crawl/utils';
import { Document, SchemaTypes } from 'mongoose';

import { Image } from './image.schema';
import { User } from './user.schema';
import { getViewFields } from './utils/getViewFields';

export interface TempUserDocument extends TempUser, Document {
    Mapper(): Omit<ITempUser, '_id'>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class TempUser {
    @Prop({ required: true, index: true, unique: true, ref: 'User', type: SchemaTypes.ObjectId })
    userId: User;

    @Prop({ ref: 'Image', type: SchemaTypes.ObjectId })
    imageId: Image;

    @Prop({ required: true, enum: SocialProviderType })
    provider: SocialProviderType;

    @Prop({ required: true, type: SchemaTypes.String })
    uniqueId: string;

    @Prop({ unique: true, type: SchemaTypes.String })
    nickname: string;

    @Prop({ trim: true, type: SchemaTypes.String, default: 'defaultValue' })
    name: string;

    @Prop({ type: SchemaTypes.String, default: 'defaultValue' })
    phone: string;

    @Prop({ type: SchemaTypes.String, default: 'defaultValue' })
    address: string;
}

const tempUserSchema = SchemaFactory.createForClass(TempUser);
tempUserSchema.index({ createdAt: 1 });
tempUserSchema.index({ provider: 1, uniqueId: 1 }, { unique: true });
tempUserSchema.methods = {
    Mapper() {
        return getViewFields<Omit<ITempUser, '_id'>>(this, [
            'id',
            'userId',
            'imageId',
            'provider',
            'uniqueId',
            'nickname',
            'name',
            'phone',
            'address',
            'createdAt',
            'updatedAt',
        ]);
    },
};

export { tempUserSchema };
