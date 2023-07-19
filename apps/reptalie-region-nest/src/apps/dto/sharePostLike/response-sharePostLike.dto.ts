import { InputSharePostLikeDTO } from './input-sharePostLike.dto';

export interface IResponseSharePostLikeDTO extends Pick<InputSharePostLikeDTO, 'sharePostId' | 'userId'> {
    readonly id: string;
}
