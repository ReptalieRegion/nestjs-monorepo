import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InputNotificationAgreeDTO } from '../../../dto/notification/agree/input-notificationAgree.dto';
import { TemplateType } from '../../../dto/notification/template/input-notificationTemplate.dto';
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
            service: isAgree,
            userId,
        };

        const agree = await this.notificationAgreeRepository.createAgree(dto);

        if (!agree) {
            throw new InternalServerErrorException('Failed to save notification agree.');
        }
    }

    async updateAgree(userId: string, isAgree: boolean, type: string) {
        let query;

        switch (type) {
            case '댓글':
                query = { $set: { comment: isAgree } };
                break;
            case '팔로우':
                query = { $set: { follow: isAgree } };
                break;
            case '좋아요':
                query = { $set: { like: isAgree } };
                break;
            case '공지사항':
                query = { $set: { service: isAgree } };
                break;
            default:
                throw new BadRequestException('Invalid data for the specified type.');
        }

        const result = await this.notificationAgreeRepository.updateOne({ userId }, query).exec();

        if (result.modifiedCount === 0) {
            throw new InternalServerErrorException('Failed to update notification agree.');
        }
    }

    async getAgreeInfo(userId: string) {
        const agree = await this.notificationAgreeRepository.findOne({ userId }).exec();

        if (!agree) {
            throw new NotFoundException('Notification agree information not found for the specified user.');
        }

        const { comment, like, service, follow } = agree;

        return {
            isAgreeComment: comment,
            isAgreePostLike: like,
            isAgreeService: service,
            isAgreeFollow: follow,
        };
    }

    async isPushAgree(type: TemplateType, userId: string) {
        let isPushAgree;

        const isAgree = await this.getAgreeInfo(userId);

        switch (type) {
            case TemplateType.Notice:
                isPushAgree = isAgree.isAgreeService;
                break;
            case TemplateType.Comment:
                isPushAgree = isAgree.isAgreeComment;
                break;
            case TemplateType.Like:
                isPushAgree = isAgree.isAgreePostLike;
                break;
            case TemplateType.Follow:
                isPushAgree = isAgree.isAgreeFollow;
                break;
            default:
                throw new BadRequestException('Invalid data for the specified type.');
        }

        return isPushAgree;
    }
}
