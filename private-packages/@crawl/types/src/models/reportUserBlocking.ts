import { SchemaId } from '../common/id';

interface IReportUserBlocking {
    _id: SchemaId;
    id: string;
    blocker: SchemaId;
    blocked: SchemaId;
    createdAt: Date;
    updatedAt: Date;
}

export type { IReportUserBlocking };
