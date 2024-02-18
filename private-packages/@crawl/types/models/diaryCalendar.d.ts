import { SchemaId } from '../common/id';
import { DiaryCalendarMarkType } from '../enums';

interface IDiaryCalendar {
    _id: SchemaId.Id;
    id: string;
    userId: SchemaId.Id;
    entityId: SchemaId.Id;
    memo: string;
    markType: DiaryCalendarMarkType[];
    date: Date;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type { IDiaryCalendar };
