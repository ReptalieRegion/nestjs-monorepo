import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { InputNotificationTemplateDTO } from '../../../dto/notification/template/input-notificationTemplate.dto';
import { NotificationTemplateDocument, NotificationTemplate } from '../../../schemas/notificationTemplate.schema';
import { BaseRepository } from '../../base/base.repository';

@Injectable()
export class NotificationTemplateRepository extends BaseRepository<NotificationTemplateDocument> {
    constructor(
        @InjectModel(NotificationTemplate.name) private readonly notificationTemplateModel: Model<NotificationTemplateDocument>,
    ) {
        super(notificationTemplateModel);
    }

    async createTemplate(dto: InputNotificationTemplateDTO, version: number) {
        const template = new this.notificationTemplateModel({ ...dto, version });
        const savedTemplate = await template.save();
        return savedTemplate.Mapper();
    }
}
