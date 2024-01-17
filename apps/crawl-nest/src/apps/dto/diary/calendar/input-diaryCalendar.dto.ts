import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum DiaryCalendarMarkType {
    Meal = '먹이급여',
    Cleaning = '청소',
    Molting = '탈피',
    Mating = '메이팅',
    LayingEggs = '산란',
    WarmBath = '온욕',
    Elimination = '배변',
}

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
