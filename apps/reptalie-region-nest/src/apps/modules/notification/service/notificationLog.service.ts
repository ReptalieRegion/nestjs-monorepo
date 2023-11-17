import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InputNotificationLogDTO } from '../../../dto/notification/log/input-notificationLog.dto';
import { serviceErrorHandler } from '../../../utils/error/errorHandler';
import { NotificationLogRepository } from '../repository/notificationLog.repository';

export const NotificationLogServiceToken = 'NotificationLogServiceToken';

@Injectable()
export class NotificationLogService {
    constructor(private readonly notificationLogRepository: NotificationLogRepository) {}

    async createLog(userId: string, dto: InputNotificationLogDTO) {
        try {
            const log = await this.notificationLogRepository.createLog({ ...dto, userId });

            if (!log) {
                throw new InternalServerErrorException('Failed to save notification log.');
            }

            return log.contents;
        } catch (error) {
            serviceErrorHandler(error, 'Invalid ObjectId for template Id.');
        }
    }
}
