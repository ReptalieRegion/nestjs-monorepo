import { InputTagDTO } from './input-tag.dto';

export interface IResponseTagDTO extends Pick<InputTagDTO, 'type' | 'typeId' | 'tagIds'> {
    readonly id: string;
    readonly isDeleted: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
