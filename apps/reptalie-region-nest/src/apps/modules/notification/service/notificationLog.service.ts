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

    async checkAllRead(userId: string) {
        return this.notificationLogRepository.readAllCheckLog(userId);
    }

    async updateIsClicked(userId: string, messageId: string) {
        const result = await this.notificationLogRepository
            .updateOne({ userId, messageId }, { $set: { isClicked: true } })
            .exec();

        if (result.modifiedCount === 0) {
            throw new InternalServerErrorException('Failed to update notification log isClicked.');
        }
    }

    async updateIsRead(userId: string) {
        const result = await this.notificationLogRepository
            .updateMany({ userId, isRead: false }, { $set: { isRead: true } })
            .exec();

        if (result.modifiedCount === 0) {
            throw new InternalServerErrorException('Failed to update notification log isRead.');
        }
    }

    async getLogsInfiniteScroll(userId: string, pageParam: number, limitSize: number) {
        const logs = await this.notificationLogRepository
            .find({ userId }, { messageId: 1, contents: 1, isRead: 1 })
            .sort({ createdAt: -1 })
            .skip(pageParam * limitSize)
            .limit(limitSize)
            .exec();

        const items = logs.map((entity) => {
            return { messageId: entity.messageId, contents: entity.contents, isRead: entity.isRead };
        });

        const isLastPage = logs.length < limitSize;
        const nextPage = isLastPage ? undefined : pageParam + 1;

        return { items, nextPage };
    }
}
