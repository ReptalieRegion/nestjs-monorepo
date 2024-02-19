import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IDeviceInfo, IUser } from '@private-crawl/types';
import { getCurrentDate } from '@private-crawl/utils';
import { Document, SchemaTypes } from 'mongoose';

import { Image } from './image.schema';
import { getViewFields } from './utils/getViewFields';

export interface UserDocument extends User, Document {
    Mapper(): IUser;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class User {
    @Prop({ index: true, unique: true, type: SchemaTypes.String })
    nickname: string;

    @Prop({ trim: true, type: SchemaTypes.String, default: 'defaultValue' })
    initials: string;

    @Prop({ trim: true, index: true, type: SchemaTypes.String, default: 'defaultValue' })
    name: string;

    @Prop({ index: true, type: SchemaTypes.String, default: 'defaultValue' })
    phone: string;

    @Prop({ index: true, type: SchemaTypes.String, default: 'defaultValue' })
    address: string;

    @Prop({ type: SchemaTypes.String, default: 'defaultValue' })
    fcmToken: string;

    @Prop({ type: SchemaTypes.Mixed })
    deviceInfo: IDeviceInfo;

    @Prop({ type: SchemaTypes.Date, default: getCurrentDate })
    lastAccessAt: Date;

    @Prop({ ref: 'Image', type: SchemaTypes.ObjectId })
    imageId: Image;
}

const userSchema = SchemaFactory.createForClass(User);
userSchema.index({ createdAt: 1 });
userSchema.methods = {
    Mapper() {
        return getViewFields<Omit<IUser, '_id'>>(this, [
            'id',
            'name',
            'nickname',
            'initials',
            'phone',
            'address',
            'fcmToken',
            'imageId',
            'deviceInfo',
            'lastAccessAt',
            'createdAt',
            'updatedAt',
        ]);
    },
};

export { userSchema };
