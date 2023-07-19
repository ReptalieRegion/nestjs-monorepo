import { IsString } from 'class-validator';

export class InputSharePostLikeDTO {
    @IsString()
    readonly sharePostId: string;

    @IsString()
    readonly userId: string;
}
