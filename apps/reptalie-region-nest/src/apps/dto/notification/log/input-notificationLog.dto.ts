import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { BasicTemplate } from '../template/input-notificationTemplate.dto';

export enum ContentType {
    Profile = '프로필이미지',
    SharePost = '일상공유이미지',
    Notice = '공지사항',
}

export interface IMessageIdDTO {
    messageId: string;
}

class BasicContents extends BasicTemplate {
    @IsString()
    readonly deepLink: string;
}

class ProfileContent extends BasicContents {
    @IsEnum(ContentType)
    readonly type: ContentType.Profile;

    @IsString()
    readonly profileThumbnail: string;
}

class SharePostContent extends BasicContents {
    @IsEnum(ContentType)
    readonly type: ContentType.SharePost;

    @IsString()
    readonly profileThumbnail: string;

    @IsString()
    readonly postThumbnail: string;
}

class NoticeContent extends BasicContents {
    @IsEnum(ContentType)
    readonly type: ContentType.Notice;
}

export type PushLogContents = ProfileContent | SharePostContent | NoticeContent;

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
