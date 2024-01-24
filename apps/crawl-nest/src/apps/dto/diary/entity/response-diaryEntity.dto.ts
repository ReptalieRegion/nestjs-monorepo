import { InputDiaryEntityDTO } from './input-diaryEntity.dto';

export interface IResponseDiaryEntityDTO
    extends Pick<InputDiaryEntityDTO, 'userId' | 'imageId' | 'name' | 'gender' | 'hatching' | 'variety' | 'weightUnit'> {
    readonly id: string;
    readonly isDeleted: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}