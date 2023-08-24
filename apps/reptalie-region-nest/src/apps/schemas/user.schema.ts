import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { Document, SchemaTypes } from 'mongoose';
import { IResponseUserDTO } from '../dto/user/response-user.dto';
import { getCurrentDate } from '../utils/time/time';

export interface UserDocument extends User, Document {
    view(): Partial<IResponseUserDTO>;
    Mapper(): Partial<IResponseUserDTO>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class User {
    @Prop({ trim: true, unique: true, required: true, type: SchemaTypes.String })
    userId: string;

    @Prop({ required: true, type: SchemaTypes.String })
    password: string;

    @Prop({ required: true, type: SchemaTypes.String })
    salt: string;

    @Prop({ trim: true, index: true, required: true, type: SchemaTypes.String })
    name: string;

    @Prop({ index: true, required: true, type: SchemaTypes.String })
    nickname: string;

    @Prop({ index: true, required: true, type: SchemaTypes.String })
    phone: string;

    @Prop({ type: SchemaTypes.String })
    address: string;

    @Prop({ type: SchemaTypes.String })
    profileImage: string;

    @Prop({ type: SchemaTypes.Number })
    point: number;

    @Prop({ ref: 'user', type: SchemaTypes.ObjectId })
    recommender: User;
}

const userSchema = SchemaFactory.createForClass(User);
userSchema.index({ createdAt: 1 });
userSchema.methods = {
    view(): Partial<IResponseUserDTO> {
        const fields: Array<keyof IResponseUserDTO> = [
            'id',
            'address',
            'userId',
            'nickname',
            'name',
            'point',
            'recommender',
            'phone',
            'profileImage',
        ];

        const viewFields = fields.reduce(
            (prev, field) => ({
                ...prev,
                [field]: this.get(field),
            }),
            {},
        );

        return viewFields;
    },

    Mapper(): Partial<IResponseUserDTO> {
        const fields: Array<keyof IResponseUserDTO> = [
            'id',
            'address',
            'userId',
            'nickname',
            'name',
            'point',
            'recommender',
            'phone',
            'profileImage',
        ];

        const viewFields = fields.reduce((prev, field) => {
            const value = this.get(field);

            if (value === undefined) {
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
