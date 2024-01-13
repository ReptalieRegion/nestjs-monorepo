import { Injectable } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { ReportRepository } from '../repository/report.repository';

export const ReportDeleterServiceToken = 'ReportDeleterServiceToken';

@Injectable()
export class ReportDeleterService {
    constructor(private readonly reportRepository: ReportRepository) {}

    async withdrawalReportInfo(userId: string, session: ClientSession) {
        await this.reportRepository.deleteMany({ reporter: userId }, { session }).exec();
    }
}
