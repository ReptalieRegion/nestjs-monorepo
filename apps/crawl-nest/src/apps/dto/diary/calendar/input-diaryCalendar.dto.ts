import { DiaryCalendarMarkType } from '@private-crawl/types';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class InputDiaryCalendarDTO {
    @IsOptional()
    @IsString()
    readonly userId: string;

    @IsString()
    readonly entityId: string;

    @IsOptional()
    @IsString()
    readonly memo: string;

    @IsEnum(DiaryCalendarMarkType, { each: true })
    readonly markType: DiaryCalendarMarkType[];

    @IsString()
    readonly date: Date;
}

export class IUpdateCalendarDTO {
    @IsOptional()
    @IsString()
    readonly memo: string;

    @IsOptional()
    @IsEnum(DiaryCalendarMarkType, { each: true })
    readonly markType: DiaryCalendarMarkType[];
}
