import { SchemaId } from '../common/id';

interface IMetaData {
    _id: SchemaId;
    id: string;
    name: string;
    data: Map<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}

export type { IMetaData };
