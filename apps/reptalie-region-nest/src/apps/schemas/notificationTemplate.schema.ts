import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { Document, SchemaTypes } from 'mongoose';
import { BasicTemplate, TemplateProviderType, TemplateType } from '../dto/notification/template/input-notificationTemplate.dto';
import { IResponseNotificationTemplateDTO } from '../dto/notification/template/response-notificationTemplate.dto';
import { getCurrentDate } from '../utils/time/time';

export interface NotificationTemplateDocument extends NotificationTemplate, Document {
    Mapper(): IResponseNotificationTemplateDTO;
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
    Mapper(): IResponseNotificationTemplateDTO {
        const fields: Array<keyof IResponseNotificationTemplateDTO> = [
            'id',
            'type',
            'provider',
            'template',
            'version',
            'createdAt',
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
        }, {}) as IResponseNotificationTemplateDTO;

        return viewFields;
    },
};

export { NotificationTemplateSchema };
