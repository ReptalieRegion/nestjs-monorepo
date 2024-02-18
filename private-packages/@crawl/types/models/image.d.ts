import { SchemaId } from '../common/id';
import { ImageType } from '../enums';

interface IImage {
    _id: SchemaId.Id;
    id: string;
    imageKey: string;
    type: ImageType;
    typeId: SchemaId.Id;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type { IImage };
