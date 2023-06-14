import { InputSharePostReplieDTO } from './input-sharePostReplie.dto';

export interface IResponseSharePostReplieDTO
    extends Pick<InputSharePostReplieDTO, 'sharePostCommentId' | 'userId' | 'content' | 'tagId'> {
    readonly id: string;
}
