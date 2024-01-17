import { InputMetaDataDTO } from './input-metaData.dto';

export interface IResponseMetaDataDTO extends Pick<InputMetaDataDTO, 'name' | 'data'> {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
