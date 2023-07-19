import { IsString } from 'class-validator';

export class InputSharePostDTO {
    @IsString()
    readonly userId: string;

    @IsString()
    readonly content: string;
}
