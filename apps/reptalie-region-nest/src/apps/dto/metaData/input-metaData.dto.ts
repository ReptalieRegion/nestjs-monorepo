import { IsString } from 'class-validator';

export class InputMetaDataDTO {
    @IsString()
    readonly name: string;

    @IsString()
    readonly data: string;
}
