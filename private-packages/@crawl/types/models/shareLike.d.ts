import { SchemaId } from '../common/id';

interface IShareLike {
    _id: SchemaId.Id;
    id: string;
    postId: SchemaId.Id;
    userId: SchemaId.Id;
    isCanceled: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type { IShareLike };
