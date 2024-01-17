import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { Document, SchemaTypes } from 'mongoose';
import { IResponseNotificationAgreeDTO } from '../dto/notification/agree/response-notificationAgree.dto';
import { getCurrentDate } from '../utils/time/time';
import { User } from './user.schema';

export interface NotificationAgreeDocument extends NotificationAgree, Document {
    Mapper(): Partial<IResponseNotificationAgreeDTO>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class NotificationAgree {
    @Prop({ ref: 'User', type: SchemaTypes.ObjectId, index: true, unique: true })
    userId: User;

    @Prop({ required: true, type: SchemaTypes.Boolean })
    device: boolean;

    @Prop({ required: true, type: SchemaTypes.Boolean })
    comment: boolean;

    @Prop({ required: true, type: SchemaTypes.Boolean })
    like: boolean;

    @Prop({ required: true, type: SchemaTypes.Boolean })
    follow: boolean;

    @Prop({ required: true, type: SchemaTypes.Boolean })
    tag: boolean;

    @Prop({ required: true, type: SchemaTypes.Boolean })
    service: boolean;
}

const NotificationAgreeSchema = SchemaFactory.createForClass(NotificationAgree);
NotificationAgreeSchema.methods = {
    Mapper(): Partial<IResponseNotificationAgreeDTO> {
        const fields: Array<keyof IResponseNotificationAgreeDTO> = [
            'id',
            'userId',
            'device',
            'comment',
            'like',
            'follow',
            'tag',
            'service',
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

export { NotificationAgreeSchema };
