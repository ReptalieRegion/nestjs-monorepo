import { Injectable } from '@nestjs/common';
import { ReportType } from '../../../dto/report/input-report.dto';
import { ReportRepository } from '../repository/report.repository';

export const ReportSearcherServiceToken = 'ReportSearcherServiceToken';

@Injectable()
export class ReportSearcherService {
    constructor(private readonly reportRepository: ReportRepository) {}

    async findTypeIdList(reporter: string, type: ReportType): Promise<string[] | undefined> {
        if (!reporter) {
            return undefined;
        }

        const report = await this.reportRepository.find({ reporter, type }, { typeId: 1 }).exec();

        const typeIds = report.reduce<string[]>((accumulator, entity) => {
            const typeId = entity.Mapper().typeId;

            if (typeof typeId === 'string' && !accumulator.includes(typeId)) {
                accumulator.push(typeId);
            }
            return accumulator;
        }, []);

        return typeIds.length > 0 ? typeIds : undefined;
    }
}
