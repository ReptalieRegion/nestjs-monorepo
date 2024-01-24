import { InputNotificationTemplateDTO } from './input-notificationTemplate.dto';

export interface IResponseNotificationTemplateDTO
    extends Pick<InputNotificationTemplateDTO, 'type' | 'provider' | 'template' | 'version'> {
    readonly id: string;
    readonly createdAt: Date;
}
