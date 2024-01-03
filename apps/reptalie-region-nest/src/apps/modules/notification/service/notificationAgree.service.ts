import { HttpStatus, Injectable } from '@nestjs/common';
import { InputNotificationAgreeDTO } from '../../../dto/notification/agree/input-notificationAgree.dto';
import { TemplateType } from '../../../dto/notification/template/input-notificationTemplate.dto';
import { CustomException } from '../../../utils/error/customException';
import { NotificationAgreeRepository } from '../repository/notificationAgree.repository';

export const NotificationAgreeServiceToken = 'NotificationAgreeServiceToken';

@Injectable()
export class NotificationAgreeService {
    constructor(private readonly notificationAgreeRepository: NotificationAgreeRepository) {}

    async createAgree(userId: string) {
        const isExistsAgree = await this.notificationAgreeRepository.findOne({ userId }).exec();

        if (isExistsAgree) {
            throw new CustomException('Data has already been created.', HttpStatus.BAD_REQUEST, -1000);
        }

        const dto: InputNotificationAgreeDTO = {
            device: false,
            comment: true,
            follow: true,
            like: true,
            tag: true,
            service: true,
            userId,
        };

        const agree = await this.notificationAgreeRepository.createAgree(dto);

        if (!agree) {
            throw new CustomException('Failed to save notification agree.', HttpStatus.INTERNAL_SERVER_ERROR, -1000);
        }

        return { message: 'Success' };
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
            case '태그':
                query = { $set: { tag: isAgree } };
                break;
            case '기기':
                query = { $set: { device: isAgree } };
                break;
            default:
                throw new CustomException('Invalid data for the specified type.', HttpStatus.BAD_REQUEST, -1000);
        }

        const result = await this.notificationAgreeRepository.updateOne({ userId }, query).exec();

        if (result.modifiedCount === 0) {
            throw new CustomException('Failed to update notification agree.', HttpStatus.INTERNAL_SERVER_ERROR, -1000);
        }
    }

    async getAgreeInfo(userId: string) {
        const agree = await this.notificationAgreeRepository.findOne({ userId }).exec();

        if (!agree) {
            throw new CustomException('Not found for the specified notification agree info.', HttpStatus.NOT_FOUND, -1000);
        }

        const { comment, like, service, follow, tag, device } = agree;

        return {
            isAgreeComment: device && comment,
            isAgreePostLike: device && like,
            isAgreeService: device && service,
            isAgreeFollow: device && follow,
            isAgreeTag: device && tag,
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
            case TemplateType.Tag:
                isPushAgree = isAgree.isAgreeTag;
                break;
            default:
                throw new CustomException('Invalid data for the specified type.', HttpStatus.BAD_REQUEST, -1000);
        }

        return isPushAgree;
    }
}
