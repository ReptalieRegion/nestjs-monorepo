import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { Document, SchemaTypes } from 'mongoose';
import { DeviceInfoDTO } from '../dto/user/user/device-info.dto';
import { IResponseUserDTO } from '../dto/user/user/response-user.dto';
import { getCurrentDate } from '../utils/time/time';
import { Image } from './image.schema';

export interface UserDocument extends User, Document {
    Mapper(): Partial<IResponseUserDTO>;
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
    deviceInfo: DeviceInfoDTO;

    @Prop({ type: SchemaTypes.Date, default: getCurrentDate })
    lastAccessAt: Date;

    @Prop({ ref: 'Image', type: SchemaTypes.ObjectId })
    imageId: Image;
}

const userSchema = SchemaFactory.createForClass(User);
userSchema.index({ createdAt: 1 });
userSchema.methods = {
    Mapper(): Partial<IResponseUserDTO> {
        const fields: Array<keyof IResponseUserDTO> = [
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
        ];

        const viewFields = fields.reduce((prev, field) => {
            const value = this.get(field);

            if (value === undefined || value === 'defaultValue') {
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

export { userSchema };
