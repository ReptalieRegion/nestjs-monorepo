import { InputSharePostCommentDTO } from './input-sharePostCommnet.dto';

export interface IResponseSharePostCommentDTO
    extends Pick<InputSharePostCommentDTO, 'sharePostId' | 'userId' | 'content' | 'tagId'> {
    readonly id: string;
}
