import { SchemaId } from '../common/id';
import { ImageType } from '../enums';

interface IImage {
    _id: SchemaId;
    id: string;
    imageKey: string;
    type: ImageType;
    typeId: SchemaId;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type { IImage };
