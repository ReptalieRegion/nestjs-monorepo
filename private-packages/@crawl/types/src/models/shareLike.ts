import { SchemaId } from '../common/id';

interface IShareLike {
    _id: SchemaId;
    id: string;
    postId: SchemaId;
    userId: SchemaId;
    isCanceled: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type { IShareLike };
