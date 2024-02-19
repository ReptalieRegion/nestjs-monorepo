import { DiaryEntityGenderType, DiaryEntityWeightType } from '@private-crawl/types';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';

export class BasicVariety {
    @IsString()
    readonly classification: string;

    @IsString()
    readonly species: string;

    @IsString()
    readonly detailedSpecies: string;

    @IsOptional()
    @IsString({ each: true })
    readonly morph: string[] | string;
}

export class InputDiaryEntityDTO {
    @IsOptional()
    @IsString()
    readonly userId: string;

    @IsOptional()
    @IsString()
    readonly imageId: string;

    @IsString()
    readonly name: string;

    @IsEnum(DiaryEntityGenderType)
    readonly gender: DiaryEntityGenderType;

    @ValidateNested()
    @Type(() => BasicVariety)
    readonly variety: BasicVariety;

    @IsOptional()
    @IsString()
    readonly hatching: Date;

    @IsEnum(DiaryEntityWeightType)
    readonly weightUnit: DiaryEntityWeightType;
}

export class IUpdateEntityDTO {
    @IsOptional()
    @IsString()
    readonly imageId: string;

    @IsOptional()
    @IsString()
    readonly name: string;

    @IsOptional()
    @IsEnum(DiaryEntityGenderType)
    readonly gender: DiaryEntityGenderType;

    @IsOptional()
    @ValidateNested()
    @Type(() => BasicVariety)
    readonly variety: BasicVariety;

    @IsOptional()
    @IsString()
    readonly hatching: Date;
}
