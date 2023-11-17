import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InputNotificationTemplateDTO } from '../../../dto/notification/template/input-notificationTemplate.dto';
import { NotificationTemplateRepository } from '../repository/notificationTemplate.repository';

export const NotificationTemplateServiceToken = 'NotificationTemplateServiceToken';

@Injectable()
export class NotificationTemplateService {
    constructor(private readonly notificationTemplateRepository: NotificationTemplateRepository) {}

    async createPushTemplate(dto: InputNotificationTemplateDTO) {
        const isExistsTemplate = await this.notificationTemplateRepository
            .findOne({ type: dto.type, provider: dto.provider })
            .sort({ version: -1 })
            .limit(1)
            .exec();

        const mapTempalte = isExistsTemplate?.Mapper();
        const version = mapTempalte?.version ? mapTempalte.version + 1 : 1;

        const template = await this.notificationTemplateRepository.createTemplate(dto, version);

        if (!template) {
            throw new InternalServerErrorException('Failed to save notification template.');
        }
    }
}
