import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum ReportType {
    POST = '게시글',
    COMMENT = '댓글',
    REPLY = '대댓글',
}

export enum ReportDetailsType {
    PORNOGRAPHY = '성적인 내용이나 음란물이에요',
    ABUSE_LANGUAGE = '욕설, 생명경시, 비방적 언어 등의 내용이에요',
    ADVERTISING = '상업적인 내용이나 광고 목적의 내용이에요',
    ILLEGAL_INFORMATION = '불법 정보 또는 행위와 관련된 내용이에요',
    PRIVACY_EXPOSURE = '다른 사용자의 개인정보를 무단으로 노출했어요',
}

export class InputReportDTO {
    @IsOptional()
    @IsString()
    readonly reporter: string;

    @IsString()
    readonly reported: string;

    @IsEnum(ReportType)
    readonly type: ReportType;

    @IsString()
    readonly typeId: string;

    @IsEnum(ReportDetailsType)
    readonly details: ReportDetailsType;
}
