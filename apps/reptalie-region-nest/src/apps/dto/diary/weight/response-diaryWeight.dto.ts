import { InputDiaryWeightDTO } from './input-diaryWeight.dto';

export interface IResponseDiaryWeightDTO extends Pick<InputDiaryWeightDTO, 'entityId' | 'date' | 'weight'> {
    readonly id: string;
    readonly isDeleted: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
