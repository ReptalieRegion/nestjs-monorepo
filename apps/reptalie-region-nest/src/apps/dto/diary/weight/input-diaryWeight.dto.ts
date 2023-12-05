import { IsDecimal, IsString } from 'class-validator';

export class InputDiaryWeightDTO {
    @IsString()
    readonly entityId: string;

    @IsString()
    readonly date: Date;

    @IsDecimal()
    readonly weight: number;
}
