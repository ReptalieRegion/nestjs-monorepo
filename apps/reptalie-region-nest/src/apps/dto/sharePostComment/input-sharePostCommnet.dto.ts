import { IsString } from 'class-validator';

export class InputSharePostCommentDTO {
    @IsString()
    readonly sharePostId: string;

    @IsString()
    readonly userId: string;

    @IsString()
    readonly content: string;

    @IsString()
    readonly tagId: string;
}
