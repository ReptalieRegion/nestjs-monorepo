import { SchemaId } from '../common/id';

interface IReportUserBlocking {
    _id: SchemaId.Id;
    id: string;
    blocker: SchemaId.Id;
    blocked: SchemaId.Id;
    createdAt: Date;
    updatedAt: Date;
}

export type { IReportUserBlocking };
