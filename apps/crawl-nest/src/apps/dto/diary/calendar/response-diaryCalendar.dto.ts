import { InputDiaryCalendarDTO } from './input-diaryCalendar.dto';

export interface IResponseDiaryCalendarDTO
    extends Pick<InputDiaryCalendarDTO, 'userId' | 'entityId' | 'memo' | 'markType' | 'date'> {
    readonly id: string;
    readonly isDeleted: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
