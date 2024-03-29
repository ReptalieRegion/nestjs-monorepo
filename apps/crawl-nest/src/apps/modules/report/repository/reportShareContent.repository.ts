import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReportShareContent, ReportShareContentDocument } from '@private-crawl/models';
import { Model } from 'mongoose';

import { InputReportShareContentDTO } from '../../../dto/report/share/input-reportShareContent.dto';
import { BaseRepository } from '../../base/base.repository';

@Injectable()
export class ReportShareContentRepository extends BaseRepository<ReportShareContentDocument> {
    constructor(
        @InjectModel(ReportShareContent.name) private readonly reportShareContentModel: Model<ReportShareContentDocument>,
    ) {
        super(reportShareContentModel);
    }

    async createReportShareContent(reportInfo: InputReportShareContentDTO) {
        const report = new this.reportShareContentModel(reportInfo);
        const savedReport = await report.save();
        return savedReport.Mapper();
    }
}
