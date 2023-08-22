import { InputShareCommentDTO } from './input-shareComment.dto';

export interface IResponseShareCommentDTO extends Pick<InputShareCommentDTO, 'postId' | 'userId' | 'contents'> {
    readonly id: string;
    readonly replyCount: number;
    readonly isDeleted: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
