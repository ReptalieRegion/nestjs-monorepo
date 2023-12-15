import { Injectable } from '@nestjs/common';
import { ReportRepository } from '../repository/report.repository';

export const ReportSearcherServiceToken = 'ReportSearcherServiceToken';

@Injectable()
export class ReportSearcherService {
    constructor(private readonly reportRepository: ReportRepository) {}
}
