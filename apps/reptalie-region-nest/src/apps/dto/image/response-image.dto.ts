import { InputImageDTO } from './input-image.dto';

export interface IResponseImageDTO extends Pick<InputImageDTO, 'imageKeys' | 'type' | 'typeId'> {
    readonly id: string;
    readonly isDeleted: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
