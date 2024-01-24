import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum ReportShareContentType {
    POST = '게시글',
    COMMENT = '댓글',
    REPLY = '대댓글',
}

export enum ReportShareContentDetailsType {
    PORNOGRAPHY = '성적인 내용이나 음란물이에요',
    ABUSE_LANGUAGE = '욕설, 생명경시, 비방적 언어 등의 내용이에요',
    ADVERTISING = '상업적인 내용이나 광고 목적의 내용이에요',
    ILLEGAL_INFORMATION = '불법 정보 또는 행위와 관련된 내용이에요',
    PRIVACY_EXPOSURE = '다른 사용자의 개인정보를 무단으로 노출했어요',
}

export class InputReportShareContentDTO {
    @IsOptional()
    @IsString()
    readonly reporter: string;

    @IsString()
    readonly reported: string;

    @IsEnum(ReportShareContentType)
    readonly type: ReportShareContentType;

    @IsString()
    readonly typeId: string;

    @IsEnum(ReportShareContentDetailsType)
    readonly details: ReportShareContentDetailsType;
}
