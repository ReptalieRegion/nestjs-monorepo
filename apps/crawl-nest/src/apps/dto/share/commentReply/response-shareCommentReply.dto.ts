import { InputShareCommentReplyDTO } from './input-shareCommentReply.dto';

export interface IResponseShareCommentReplyDTO
    extends Pick<InputShareCommentReplyDTO, 'commentId' | 'contents'> {
    readonly id: string;
    readonly userId: string;
    readonly isDeleted: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
