import { InputShareCommentDTO } from './input-shareComment.dto';

export interface IResponseShareCommentDTO extends Pick<InputShareCommentDTO, 'postId' | 'contents'> {
    readonly id: string;
    readonly userId: string;
    readonly isDeleted: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
