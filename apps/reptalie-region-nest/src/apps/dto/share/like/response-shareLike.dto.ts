import { InputShareLikeDTO } from './input-shareLike.dto';

export interface IResponseShareLikeDTO extends Pick<InputShareLikeDTO, 'postId'> {
    readonly id: string;
    readonly userId: string;
    readonly isCanceled: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
