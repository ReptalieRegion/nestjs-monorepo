import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { Document, SchemaTypes } from 'mongoose';
import { IResponseUserDTO } from '../dto/user/user/response-user.dto';
import { getCurrentDate } from '../utils/time/time';
import { Image } from './image.schema';

export interface UserDocument extends User, Document {
    Mapper(): Partial<IResponseUserDTO>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class User {
    @Prop({ index: true, type: SchemaTypes.String, default: 'defaultValue' })
    nickname: string;

    @Prop({ trim: true, index: true, type: SchemaTypes.String, default: 'defaultValue1' })
    name: string;

    @Prop({ index: true, type: SchemaTypes.String, default: 'defaultValue1' })
    phone: string;

    @Prop({ type: SchemaTypes.String, default: 'defaultValue1' })
    address: string;

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
            'phone',
            'address',
            'imageId',
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
