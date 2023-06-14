import { IsString } from 'class-validator';

export class InputSharePostReplieDTO {
    @IsString()
    sharePostCommentId: string;

    @IsString()
    userId: string;

    @IsString()
    content: string;

    @IsString()
    tagId: string;
}
