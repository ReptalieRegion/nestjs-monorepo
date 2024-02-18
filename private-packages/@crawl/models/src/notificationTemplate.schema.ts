import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BasicTemplate, INotificationTemplate, TemplateProviderType, TemplateType } from '@private-crawl/types';
import { getCurrentDate } from '@private-crawl/utils';

import { Document, SchemaTypes } from 'mongoose';
import { getViewFields } from './utils/getViewFields';

export interface NotificationTemplateDocument extends NotificationTemplate, Document {
    Mapper(): Omit<INotificationTemplate, '_id'>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate, createdAt: true, updatedAt: false } })
export class NotificationTemplate {
    @Prop({ required: true, enum: TemplateType })
    type: TemplateType;

    @Prop({ required: true, enum: TemplateProviderType })
    provider: TemplateProviderType;

    @Prop({ required: true, type: SchemaTypes.Mixed })
    template: BasicTemplate;

    @Prop({ required: true, type: SchemaTypes.Number })
    version: number;
}

const NotificationTemplateSchema = SchemaFactory.createForClass(NotificationTemplate);
NotificationTemplateSchema.index({ type: 1, provider: 1 });
NotificationTemplateSchema.methods = {
    Mapper() {
        return getViewFields<Omit<INotificationTemplate, '_id'>>(this, [
            'id',
            'type',
            'provider',
            'template',
            'version',
            'createdAt',
        ]);
    },
};

export { NotificationTemplateSchema };
