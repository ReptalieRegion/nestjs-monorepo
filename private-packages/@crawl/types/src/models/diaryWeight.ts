import { SchemaId } from '../common/id';

interface IDiaryWeight {
    _id: SchemaId;
    id: string;
    entityId: SchemaId;
    date: Date;
    weight: number;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type { IDiaryWeight };
