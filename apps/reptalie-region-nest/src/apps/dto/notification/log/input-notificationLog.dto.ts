import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { BasicTemplate } from '../template/input-notificationTemplate.dto';

export enum ContentType {
    Profile = '프로필이미지',
    SharePost = '일상공유이미지',
}

export interface IMessageIdDTO {
    messageId: string;
}

class BasicContents extends BasicTemplate {
    @IsEnum(ContentType)
    readonly type: ContentType;

    @IsString()
    readonly deepLink: string;
}

class ProfileContent extends BasicContents {
    @IsString()
    readonly profileThumbnail: string;
}

class SharePostContent extends BasicContents {
    @IsString()
    readonly profileThumbnail?: string;

    @IsString()
    readonly postThumbnail?: string;
}

export type PushLogContents = ProfileContent | SharePostContent;

export class InputNotificationLogDTO {
    @IsOptional()
    @IsString()
    readonly userId: string;

    @IsString()
    readonly templateId: string;

    @IsString()
    readonly messageId: string;

    @ValidateNested()
    readonly contents: PushLogContents;
}
