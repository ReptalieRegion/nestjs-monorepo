import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum DiaryCalendarMarkType {
    '먹이급여' = '먹이급여',
    '청소' = '청소',
    '탈피' = '탈피',
    '메이팅' = '메이팅',
    '산란' = '산란',
    '온욕' = '온욕',
    '배변' = '배변',
}

export class InputDiaryCalendarDTO {
    @IsOptional()
    @IsString()
    readonly userId: string;

    @IsOptional()
    @IsString()
    readonly entityId: string;

    @IsString()
    readonly memo: string;

    @IsEnum(DiaryCalendarMarkType)
    readonly markType: DiaryCalendarMarkType;

    @IsString()
    readonly date: Date;
}
