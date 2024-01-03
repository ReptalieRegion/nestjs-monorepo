import { IsOptional, IsString } from 'class-validator';

export class InputShareCommentDTO {
    @IsOptional()
    @IsString()
    readonly postId: string;

    @IsString()
    readonly contents: string;
}
