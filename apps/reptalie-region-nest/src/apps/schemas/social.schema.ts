import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { Document, SchemaTypes } from 'mongoose';
import { JoinProgressType, SocialProvierType } from '../dto/user/social/input-social.dto';
import { IResponseSocialDTO } from '../dto/user/social/response-social.dto';
import { getCurrentDate } from '../utils/time/time';
import { User } from './user.schema';

export interface SocialDocument extends Social, Document {
    Mapper(): Partial<IResponseSocialDTO>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class Social {
    @Prop({ required: true, index: true, ref: 'User', type: SchemaTypes.ObjectId })
    userId: User;

    @Prop({ required: true, enum: SocialProvierType })
    provider: SocialProvierType;

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
    Mapper(): Partial<IResponseSocialDTO> {
        const fields: Array<keyof IResponseSocialDTO> = [
            'id',
            'userId',
            'provider',
            'uniqueId',
            'joinProgress',
            'salt',
            'refreshToken',
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

export { socialSchema };
