import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsString, ValidateNested } from 'class-validator';

export enum DiaryEntityGenderType {
    Male = 'Male',
    Female = 'Female',
    Uncategorized = 'Uncategorized',
}

export class BasicVariety {
    @IsString()
    readonly mainCategory: string;

    @IsString()
    readonly subCategory: string;

    @IsString()
    readonly morph: string;
}

export class BasicWeight {
    @IsDate()
    readonly date: Date;

    @IsString()
    readonly weight: string;
}

export class InputDiaryEntityDTO {
    @IsString()
    readonly userId: string;

    @IsString()
    readonly imageId: string;

    @IsString()
    readonly name: string;

    @IsEnum(DiaryEntityGenderType)
    readonly gender: DiaryEntityGenderType;

    @ValidateNested()
    @Type(() => BasicVariety)
    readonly variety: BasicVariety;

    @IsDate()
    readonly hatching: Date;

    @IsArray()
    @ValidateNested()
    @Type(() => BasicWeight)
    readonly weight: BasicWeight[];
}
