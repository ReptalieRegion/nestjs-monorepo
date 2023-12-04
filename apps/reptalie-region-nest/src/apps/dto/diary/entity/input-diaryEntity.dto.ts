import { Type } from 'class-transformer';
import { IsArray, IsDecimal, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';

export enum DiaryEntityGenderType {
    Male = 'Male',
    Female = 'Female',
    Uncategorized = 'Uncategorized',
}

export class BasicVariety {
    @IsString()
    readonly classification: string;

    @IsString()
    readonly species: string;

    @IsString()
    readonly detailedSpecies: string;

    @IsArray()
    @IsString({ each: true })
    readonly morph: string[];
}

export class BasicWeight {
    @IsString()
    readonly date: Date;

    @IsOptional()
    @IsDecimal()
    readonly weight: number;
}

export interface IUpdateEntityDTO {
    readonly name: string;
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

    @IsString()
    readonly hatching: Date;

    @ValidateNested()
    @Type(() => BasicWeight)
    readonly weight: BasicWeight;
}
