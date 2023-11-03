import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { Document, SchemaTypes } from 'mongoose';
import { IResponseFollowDTO } from '../dto/user/follow/response-follow.dto';
import { getCurrentDate } from '../utils/time/time';
import { User } from './user.schema';

export interface FollowDocument extends Follow, Document {
    Mapper(): Partial<IResponseFollowDTO>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class Follow {
    @Prop({ ref: 'User', type: SchemaTypes.ObjectId })
    following: User;

    @Prop({ ref: 'User', type: SchemaTypes.ObjectId })
    follower: User;

    @Prop({ required: true, type: SchemaTypes.String })
    followerNickname: string;

    @Prop({ default: false, type: SchemaTypes.Boolean })
    isCanceled: boolean;
}

const FollowSchema = SchemaFactory.createForClass(Follow);
FollowSchema.index({ following: 1, follower: 1 }, { unique: true });
FollowSchema.methods = {
    Mapper(): Partial<IResponseFollowDTO> {
        const fields: Array<keyof IResponseFollowDTO> = [
            'id',
            'following',
            'follower',
            'followerNickname',
            'isCanceled',
            'createdAt',
            'updatedAt',
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

export { FollowSchema };
