import { InputShareLikeDTO } from './input-shareLike.dto';

export interface IResponseShareLikeDTO extends Pick<InputShareLikeDTO, 'postId' | 'userId'> {
    readonly id: string;
    readonly isCancled: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
