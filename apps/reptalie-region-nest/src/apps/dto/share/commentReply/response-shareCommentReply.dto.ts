import { InputShareCommentReplyDTO } from './input-shareCommentReply.dto';

export interface IResponseShareCommentReplyDTO
    extends Pick<InputShareCommentReplyDTO, 'commentId' | 'userId' | 'contents'> {
    readonly id: string;
    readonly isDeleted: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
