import { IsString } from 'class-validator';

export class InputShareLikeDTO {
    @IsString()
    readonly userId: string;

    @IsString()
    readonly postId: string;
}
