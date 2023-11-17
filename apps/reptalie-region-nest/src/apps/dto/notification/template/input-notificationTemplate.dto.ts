import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from 'class-validator';

export enum TemplateType {
    Notice = '공지사항',
    Comment = '댓글',
    Like = '좋아요',
    Follow = '팔로우',
}

export enum TemplateProviderType {
    PUSH = 'PUSH',
    LMS = 'LMS',
    SMS = 'SMS',
}

export enum TemplateTitleType {
    Share = '일상공유',
    User = '회원',
    Service = '서비스',
}

export class BasicTemplate {
    @IsEnum(TemplateTitleType)
    readonly title: TemplateTitleType;

    @IsNotEmpty()
    readonly article: string;
}

export class InputNotificationTemplateDTO {
    @IsEnum(TemplateType)
    readonly type: TemplateType;

    @IsEnum(TemplateProviderType)
    readonly provider: TemplateProviderType;

    @IsOptional()
    @ValidateNested()
    @Type(() => BasicTemplate)
    readonly template: BasicTemplate;

    @IsNumber()
    @IsOptional()
    readonly version: number;
}
