import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NotificationAgree, NotificationAgreeDocument } from '@private-crawl/models';
import { Model } from 'mongoose';

import { InputNotificationAgreeDTO } from '../../../dto/notification/agree/input-notificationAgree.dto';
import { BaseRepository } from '../../base/base.repository';

@Injectable()
export class NotificationAgreeRepository extends BaseRepository<NotificationAgreeDocument> {
    constructor(
        @InjectModel(NotificationAgree.name) private readonly notificationAgreeModel: Model<NotificationAgreeDocument>,
    ) {
        super(notificationAgreeModel);
    }

    async createAgree(dto: InputNotificationAgreeDTO) {
        const agree = new this.notificationAgreeModel(dto);
        const savedAgree = await agree.save();
        return savedAgree.Mapper();
    }
}
