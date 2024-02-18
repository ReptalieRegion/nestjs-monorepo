import { SchemaId } from '../common/id';

interface ISharePost {
    _id: SchemaId.Id;
    id: string;
    userId: SchemaId.Id;
    contents: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type { ISharePost };
