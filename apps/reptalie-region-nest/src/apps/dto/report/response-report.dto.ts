import { InputReportDTO } from './input-report.dto';

export interface IResponseReportDTO extends Pick<InputReportDTO, 'reporter' | 'reported' | 'type' | 'typeId' | 'details'> {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
