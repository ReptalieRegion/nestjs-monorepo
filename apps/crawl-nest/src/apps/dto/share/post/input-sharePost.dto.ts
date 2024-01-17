import { IsArray, IsOptional, IsString } from 'class-validator';

export class InputSharePostDTO {
    @IsString()
    readonly contents: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    readonly remainingImages?: string[];
}
