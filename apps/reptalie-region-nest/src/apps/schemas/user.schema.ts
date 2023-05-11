import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, SchemaTypes } from 'mongoose';
import { IResponseUserDTO } from '../dto/user/response-user.dto';

export interface UserDocument extends User, Document {
    view(): Partial<IResponseUserDTO>;
}

@Schema({ versionKey: false })
export class User {
    @Prop({ trim: true, unique: true, required: true, type: SchemaTypes.String })
    email: string;

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
userSchema.set('timestamps', true);
userSchema.index({ createdAt: 1 });
userSchema.methods = {
    view(): Partial<IResponseUserDTO> {
        const fields: Array<keyof IResponseUserDTO> = [
            'id',
            'address',
            'email',
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
};

export { userSchema };
