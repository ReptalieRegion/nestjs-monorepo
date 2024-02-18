import { SchemaId } from '../common/id';

interface IMetaData {
    _id: SchemaId.Id;
    id: string;
    name: string;
    data: Map<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}

export type { IMetaData };
