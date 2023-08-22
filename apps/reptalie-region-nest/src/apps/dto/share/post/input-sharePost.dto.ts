import { IsArray, IsString, IsOptional } from 'class-validator';

export class InputSharePostDTO {
    @IsString()
    readonly userId: string;

    @IsArray()
    @IsString({ each: true })
    readonly contents: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    readonly tagIds: string[];
}
