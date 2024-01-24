import { HttpStatus, Injectable } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { InputNotificationLogDTO } from '../../../dto/notification/log/input-notificationLog.dto';
import { CustomException } from '../../../utils/error/customException';
import { CustomExceptionHandler } from '../../../utils/error/customException.handler';
import { NotificationLogRepository } from '../repository/notificationLog.repository';

export const NotificationLogServiceToken = 'NotificationLogServiceToken';

@Injectable()
export class NotificationLogService {
    constructor(private readonly notificationLogRepository: NotificationLogRepository) {}

    async createLog(userId: string, dto: InputNotificationLogDTO) {
        try {
            const log = await this.notificationLogRepository.createLog({ ...dto, userId });

            if (!log) {
                throw new CustomException('Failed to save notification log.', HttpStatus.INTERNAL_SERVER_ERROR, -4602);
            }

            return log.contents;
        } catch (error) {
            throw new CustomExceptionHandler(error).handleException('Invalid ObjectId for templateId.', -4504);
        }
    }

    async updateIsClicked(userId: string, messageId: string) {
        const result = await this.notificationLogRepository
            .updateOne({ userId, messageId }, { $set: { isClicked: true } })
            .exec();

        if (result.modifiedCount === 0) {
            throw new CustomException('Failed to update notification log isClicked.', HttpStatus.INTERNAL_SERVER_ERROR, -4605);
        }
    }

    async updateIsRead(userId: string) {
        const result = await this.notificationLogRepository
            .updateMany({ userId, isRead: false }, { $set: { isRead: true } })
            .exec();

        if (result.modifiedCount === 0) {
            throw new CustomException('Failed to update notification log isRead.', HttpStatus.INTERNAL_SERVER_ERROR, -4604);
        }
    }

    async getLogsInfiniteScroll(userId: string, pageParam: number, limitSize: number) {
        const logs = await this.notificationLogRepository
            .find({ userId }, { messageId: 1, contents: 1, isRead: 1, createdAt: 1 })
            .sort({ createdAt: -1 })
            .skip(pageParam * limitSize)
            .limit(limitSize)
            .exec();

        const items = logs.map((entity) => {
            return {
                messageId: entity.messageId,
                contents: entity.contents,
                isRead: entity.isRead,
                createdAt: entity.createdAt,
            };
        });

        const isLastPage = logs.length < limitSize;
        const nextPage = isLastPage ? undefined : pageParam + 1;

        return { items, nextPage };
    }

    async checkAllRead(userId: string) {
        const readCount = await this.notificationLogRepository.countDocuments({ userId, isRead: false });
        const isReadAllLog = readCount === 0;

        return { isReadAllLog };
    }

    async restoreLog(oldUserId: string, newUserId: string, session: ClientSession) {
        await this.notificationLogRepository.updateMany({ userId: oldUserId }, { $set: { userId: newUserId } }, { session });
    }
}
