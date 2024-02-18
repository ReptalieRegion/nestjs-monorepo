import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { INotificationLog, PushLogContents } from '@private-crawl/types';
import { getCurrentDate } from '@private-crawl/utils';
import { Document, SchemaTypes } from 'mongoose';

import { NotificationTemplate } from './notificationTemplate.schema';
import { User } from './user.schema';
import { getViewFields } from './utils/getViewFields';

export interface NotificationLogDocument extends NotificationLog, Document {
    createdAt: Date;
    Mapper(): INotificationLog;
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
    contents: PushLogContents;

    @Prop({ default: false, type: SchemaTypes.Boolean })
    isRead: boolean;

    @Prop({ default: false, type: SchemaTypes.Boolean })
    isClicked: boolean;
}

const NotificationLogSchema = SchemaFactory.createForClass(NotificationLog);
NotificationLogSchema.index({ userId: 1, messageId: 1 });
NotificationLogSchema.methods = {
    Mapper() {
        return getViewFields<INotificationLog>(this, [
            'id',
            'userId',
            'templateId',
            'messageId',
            'contents',
            'isRead',
            'isClicked',
            'createdAt',
            'updatedAt',
        ]);
    },
};

export { NotificationLogSchema };
