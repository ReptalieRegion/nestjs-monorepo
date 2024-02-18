import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { INotificationAgree } from '@private-crawl/types';
import { getCurrentDate } from '@private-crawl/utils';
import { Document, SchemaTypes } from 'mongoose';

import { User } from './user.schema';
import { getViewFields } from './utils/getViewFields';

export interface NotificationAgreeDocument extends NotificationAgree, Document {
    Mapper(): Omit<INotificationAgree, '_id'>;
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
    Mapper() {
        return getViewFields<Omit<INotificationAgree, '_id'>>(this, [
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
        ]);
    },
};

export { NotificationAgreeSchema };
