import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReportUserBlocking, ReportUserBlockingDocument } from '@private-crawl/models';
import { Model } from 'mongoose';

import { InputReportUserBlockingDTO } from '../../../dto/report/blocking/input-reportUserBlocking.dto';
import { BaseRepository } from '../../base/base.repository';

@Injectable()
export class ReportUserBlockingRepository extends BaseRepository<ReportUserBlockingDocument> {
    constructor(
        @InjectModel(ReportUserBlocking.name) private readonly reportUserBlockingModel: Model<ReportUserBlockingDocument>,
    ) {
        super(reportUserBlockingModel);
    }

    async createReportUserBlocking(blockingInfo: InputReportUserBlockingDTO) {
        const blcoking = new this.reportUserBlockingModel(blockingInfo);
        const savedBlcoking = await blcoking.save();
        return savedBlcoking.Mapper();
    }
}
