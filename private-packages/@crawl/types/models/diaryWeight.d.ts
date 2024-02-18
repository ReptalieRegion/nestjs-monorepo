import { SchemaId } from '../common/id';

interface IDiaryWeight {
    _id: SchemaId.Id;
    id: string;
    entityId: SchemaId.Id;
    date: Date;
    weight: number;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type { IDiaryWeight };
