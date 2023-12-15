import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { InputReportDTO } from '../../../dto/report/input-report.dto';
import { Report, ReportDocument } from '../../../schemas/report.schema';
import { BaseRepository } from '../../base/base.repository';

@Injectable()
export class ReportRepository extends BaseRepository<ReportDocument> {
    constructor(@InjectModel(Report.name) private readonly reportModel: Model<ReportDocument>) {
        super(reportModel);
    }

    async createReport(reportInfo: InputReportDTO) {
        const report = new this.reportModel(reportInfo);
        const savedReport = await report.save();
        return savedReport.Mapper();
    }
}
