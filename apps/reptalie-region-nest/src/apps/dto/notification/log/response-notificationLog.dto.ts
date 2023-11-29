import { InputNotificationLogDTO } from './input-notificationLog.dto';

export interface IResponseNotificationLogDTO
    extends Pick<InputNotificationLogDTO, 'userId' | 'templateId' | 'messageId' | 'contents'> {
    readonly id: string;
    readonly isRead: boolean;
    readonly isClicked: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
