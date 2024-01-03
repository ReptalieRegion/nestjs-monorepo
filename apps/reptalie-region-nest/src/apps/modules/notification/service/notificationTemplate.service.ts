import { HttpStatus, Injectable } from '@nestjs/common';
import { InputNotificationTemplateDTO } from '../../../dto/notification/template/input-notificationTemplate.dto';
import { CustomException } from '../../../utils/error/customException';
import { NotificationTemplateRepository } from '../repository/notificationTemplate.repository';

export const NotificationTemplateServiceToken = 'NotificationTemplateServiceToken';

@Injectable()
export class NotificationTemplateService {
    constructor(private readonly notificationTemplateRepository: NotificationTemplateRepository) {}

    async createPushTemplate(dto: InputNotificationTemplateDTO) {
        const isExistsTemplate = await this.notificationTemplateRepository
            .findOne({ type: dto.type, provider: dto.provider })
            .sort({ version: -1 })
            .exec();

        const mapTemplate = isExistsTemplate?.Mapper();
        const version = mapTemplate?.version ? mapTemplate.version + 1 : 1;

        const template = await this.notificationTemplateRepository.createTemplate(dto, version);

        if (!template) {
            throw new CustomException('Failed to save notification template.', HttpStatus.INTERNAL_SERVER_ERROR, -1000);
        }
    }

    async deleteTemplate(dto: InputNotificationTemplateDTO) {
        const result = await this.notificationTemplateRepository
            .deleteOne({ type: dto.type, provider: dto.provider, version: dto.version })
            .exec();

        if (result.deletedCount === 0) {
            throw new CustomException('Failed to delete notification template.', HttpStatus.INTERNAL_SERVER_ERROR, -1000);
        }
    }
}
