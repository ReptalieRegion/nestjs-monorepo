import { SchemaId } from '../common/id';
import { ReportShareContentDetailsType, ReportShareContentType } from '../enums';

interface IReportShareContent {
    _id: SchemaId.Id;
    id: string;
    reporter: SchemaId.Id;
    reported: SchemaId.Id;
    type: ReportShareContentType;
    typeId: SchemaId.Id;
    details: ReportShareContentDetailsType;
    createdAt: Date;
    updatedAt: Date;
}

export type { IReportShareContent };
