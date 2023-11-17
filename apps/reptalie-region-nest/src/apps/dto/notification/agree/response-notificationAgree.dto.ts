import { InputNotificationAgreeDTO } from './input-notificationAgree.dto';

export interface IResponseNotificationAgreeDTO
    extends Pick<InputNotificationAgreeDTO, 'userId' | 'comment' | 'like' | 'post' | 'follow' | 'service'> {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
