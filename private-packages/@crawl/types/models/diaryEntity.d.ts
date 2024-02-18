import { SchemaId } from '../common/id';
import { DiaryEntityGenderType, DiaryEntityWeightType } from '../enums';

interface IBasicVariety {
    classification: string;
    species: string;
    detailedSpecies: string;
    morph: string[] | string;
}

interface IDiaryEntity {
    _id: SchemaId.Id;
    id: string;
    userId: SchemaId.Id;
    imageId: SchemaId.Id;
    name: string;
    gender: DiaryEntityGenderType;
    variety: IBasicVariety;
    hatching: Date;
    weightUnit: DiaryEntityWeightType;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type { IBasicVariety, IDiaryEntity };
