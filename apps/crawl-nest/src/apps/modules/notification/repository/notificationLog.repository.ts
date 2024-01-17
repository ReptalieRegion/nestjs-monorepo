import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { InputNotificationLogDTO } from '../../../dto/notification/log/input-notificationLog.dto';
import { NotificationLog, NotificationLogDocument } from '../../../schemas/notificationLog.schema';
import { BaseRepository } from '../../base/base.repository';

@Injectable()
export class NotificationLogRepository extends BaseRepository<NotificationLogDocument> {
    constructor(@InjectModel(NotificationLog.name) private readonly notificationLogModel: Model<NotificationLogDocument>) {
        super(notificationLogModel);
    }

    async createLog(dto: InputNotificationLogDTO) {
        const log = new this.notificationLogModel({ ...dto, userId: dto.userId });
        const savedLog = await log.save();
        return savedLog.Mapper();
    }
}
