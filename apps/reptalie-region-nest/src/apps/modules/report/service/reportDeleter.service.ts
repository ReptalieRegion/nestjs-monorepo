import { HttpStatus, Injectable } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { CustomException } from '../../../utils/error/customException';
import { CustomExceptionHandler } from '../../../utils/error/customException.handler';
import { ReportShareContentRepository } from '../repository/reportShareContent.repository';
import { ReportUserBlockingRepository } from '../repository/reportUserBlocking.repository';

export const ReportDeleterServiceToken = 'ReportDeleterServiceToken';

@Injectable()
export class ReportDeleterService {
    constructor(
        private readonly reportShareContentRepository: ReportShareContentRepository,
        private readonly reportUserBlockingRepository: ReportUserBlockingRepository,
    ) {}

    async deleteReportUserBlocking(blocker: string, blockingId: string) {
        try {
            const result = await this.reportUserBlockingRepository.deleteOne({ _id: blockingId, blocker }).exec();

            if (result.deletedCount === 0) {
                throw new CustomException('Failed to delete report user blocking.', HttpStatus.INTERNAL_SERVER_ERROR, -6603);
            }

            return { message: 'Success' };
        } catch (error) {
            throw new CustomExceptionHandler(error).handleException('Invalid ObjectId for report user blocking Id.', -6503);
        }
    }

    async withdrawalReportInfo(userId: string, session: ClientSession) {
        await this.reportShareContentRepository.deleteMany({ reporter: userId }, { session }).exec();
        await this.reportUserBlockingRepository.deleteMany({ blocker: userId }, { session }).exec();
    }
}
