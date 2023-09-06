import { IsString, IsOptional } from 'class-validator';

export class InputShareCommentReplyDTO {
    @IsOptional()
    @IsString()
    readonly commentId: string;

    @IsString()
    readonly contents: string;

}
