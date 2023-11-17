import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InputNotificationAgreeDTO } from '../../../dto/notification/agree/input-notificationAgree.dto';
import { NotificationAgreeRepository } from '../repository/notificationAgree.repository';

export const NotificationAgreeServiceToken = 'NotificationAgreeServiceToken';

@Injectable()
export class NotificationAgreeService {
    constructor(private readonly notificationAgreeRepository: NotificationAgreeRepository) {}

    async createAgree(userId: string, isAgree: boolean) {
        const isExistsAgree = await this.notificationAgreeRepository.findOne({ userId }).exec();

        if (isExistsAgree) {
            throw new BadRequestException('Data has already been created.');
        }

        const dto: InputNotificationAgreeDTO = {
            comment: isAgree,
            follow: isAgree,
            like: isAgree,
            post: isAgree,
            service: isAgree,
            userId,
        };

        const agree = await this.notificationAgreeRepository.createAgree(dto);

        if (!agree) {
            throw new InternalServerErrorException('Failed to save notification agree.');
        }
    }
}
