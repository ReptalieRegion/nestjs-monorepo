import { InputReportShareContentDTO } from './input-reportShareContent.dto';

export interface IResponseReportShareContentDTO
    extends Pick<InputReportShareContentDTO, 'reporter' | 'reported' | 'type' | 'typeId' | 'details'> {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
