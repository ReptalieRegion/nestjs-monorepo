import { InputNotificationAgreeDTO } from './input-notificationAgree.dto';

export interface IResponseNotificationAgreeDTO
    extends Pick<InputNotificationAgreeDTO, 'userId' | 'device' | 'comment' | 'like' | 'follow' | 'tag' | 'service'> {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
