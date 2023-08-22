import { IsString, IsArray, IsOptional } from 'class-validator';

export class InputShareCommentDTO {
    @IsString()
    readonly postId: string;

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
