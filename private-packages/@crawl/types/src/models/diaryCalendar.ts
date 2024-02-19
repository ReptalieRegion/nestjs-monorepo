import { SchemaId } from '../common';
import { DiaryCalendarMarkType } from '../enums';

interface IDiaryCalendar {
    _id: SchemaId;
    id: string;
    userId: SchemaId;
    entityId: SchemaId;
    memo: string;
    markType: DiaryCalendarMarkType[];
    date: Date;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type { IDiaryCalendar };
