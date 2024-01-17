import { InputReportUserBlockingDTO } from './input-reportUserBlocking.dto';

export interface IResponseReportBlockingDTO extends Pick<InputReportUserBlockingDTO, 'blocker' | 'blocked'> {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
