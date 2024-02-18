import { SchemaId } from '../common/id';

interface IShareCommentReply {
    _id: SchemaId;
    id: string;
    commentId: SchemaId;
    userId: SchemaId;
    contents: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type { IShareCommentReply };
