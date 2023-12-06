import { IsNumber, IsOptional, IsString } from 'class-validator';

export class InputDiaryWeightDTO {
    @IsOptional()
    @IsString()
    readonly entityId: string;

    @IsString()
    readonly date: Date;

    @IsNumber()
    readonly weight: number;
}

export interface IUpdateWeightDTO {
    readonly weight: number;
}

export interface IDeleteWeightDTO {
    readonly date: Date;
}
