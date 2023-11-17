import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { Document, SchemaTypes } from 'mongoose';
import { BasicContents } from '../dto/notification/log/input-notificationLog.dto';
import { IResponseNotificationLogDTO } from '../dto/notification/log/response-notificationLog.dto';
import { getCurrentDate } from '../utils/time/time';
import { NotificationTemplate } from './notificationTemplate.schema';
import { User } from './user.schema';

export interface NotificationLogDocument extends NotificationLog, Document {
    Mapper(): Partial<IResponseNotificationLogDTO>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class NotificationLog {
    @Prop({ ref: 'User', type: SchemaTypes.ObjectId, index: true })
    userId: User;

    @Prop({ ref: 'NotificationTemplate', type: SchemaTypes.ObjectId, index: true })
    templateId: NotificationTemplate;

    @Prop({ required: true, type: SchemaTypes.String })
    messageId: string;

    @Prop({ required: true, type: SchemaTypes.Mixed })
    contents: BasicContents;

    @Prop({ default: false, type: SchemaTypes.Boolean })
    isRead: boolean;

    @Prop({ default: false, type: SchemaTypes.Boolean })
    isClicked: boolean;
}

const NotificationLogSchema = SchemaFactory.createForClass(NotificationLog);
NotificationLogSchema.index({ userId: 1, messageId: 1 });
NotificationLogSchema.methods = {
    Mapper(): Partial<IResponseNotificationLogDTO> {
        const fields: Array<keyof IResponseNotificationLogDTO> = [
            'id',
            'userId',
            'templateId',
            'messageId',
            'contents',
            'isRead',
            'isClicked',
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

export { NotificationLogSchema };
