import { SchemaId } from '../common/id';

interface IShareComment {
    _id: SchemaId.Id;
    id: string;
    postId: SchemaId.Id;
    userId: SchemaId.Id;
    contents: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type { IShareComment };
