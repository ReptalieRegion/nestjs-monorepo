import { InputMetaDataDTO } from './input-metaData.dto';

export interface IResponseMetaDataDTO extends Pick<InputMetaDataDTO, 'name' | 'values'> {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
