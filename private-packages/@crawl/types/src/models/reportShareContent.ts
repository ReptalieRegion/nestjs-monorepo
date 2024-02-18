import { SchemaId } from '../common/id';
import { ReportShareContentDetailsType, ReportShareContentType } from '../enums';

interface IReportShareContent {
    _id: SchemaId;
    id: string;
    reporter: SchemaId;
    reported: SchemaId;
    type: ReportShareContentType;
    typeId: SchemaId;
    details: ReportShareContentDetailsType;
    createdAt: Date;
    updatedAt: Date;
}

export type { IReportShareContent };
