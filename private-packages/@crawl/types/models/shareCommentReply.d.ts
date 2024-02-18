import { SchemaId } from '../common/id';

interface IShareCommentReply {
    _id: SchemaId.Id;
    id: string;
    commentId: SchemaId.Id;
    userId: SchemaId.Id;
    contents: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type { IShareCommentReply };
