import { IsString } from 'class-validator';

export class InputShareLikeDTO {
    @IsString()
    readonly postId: string;

    @IsString()
    readonly userId: string;
}
