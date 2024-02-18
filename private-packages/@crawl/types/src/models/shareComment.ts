import { SchemaId } from '../common/id';

interface IShareComment {
    _id: SchemaId;
    id: string;
    postId: SchemaId;
    userId: SchemaId;
    contents: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type { IShareComment };
