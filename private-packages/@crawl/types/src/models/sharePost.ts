import { SchemaId } from '../common/id';

interface ISharePost {
    _id: SchemaId;
    id: string;
    userId: SchemaId;
    contents: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type { ISharePost };
