import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { Document, SchemaTypes } from 'mongoose';
import { SocialProvierType } from '../dto/user/social/input-social.dto';
import { IResponseTempUserDTO } from '../dto/user/tempUser/response-tempUser.dto';
import { getCurrentDate } from '../utils/time/time';
import { Image } from './image.schema';
import { User } from './user.schema';

export interface TempUserDocument extends TempUser, Document {
    Mapper(): Partial<IResponseTempUserDTO>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class TempUser {
    @Prop({ required: true, index: true, unique: true, ref: 'User', type: SchemaTypes.ObjectId })
    userId: User;

    @Prop({ ref: 'Image', type: SchemaTypes.ObjectId })
    imageId: Image;

    @Prop({ required: true, enum: SocialProvierType })
    provider: SocialProvierType;

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
    Mapper(): Partial<IResponseTempUserDTO> {
        const fields: Array<keyof IResponseTempUserDTO> = [
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

export { tempUserSchema };
