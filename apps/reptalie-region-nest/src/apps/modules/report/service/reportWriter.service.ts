import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InputReportDTO } from '../../../dto/report/input-report.dto';
import { CustomException } from '../../../utils/error/customException';
import { ShareSearcherService, ShareSearcherServiceToken } from '../../share/service/shareSearcher.service';
import { UserSearcherService, UserSearcherServiceToken } from '../../user/service/userSearcher.service';
import { ReportRepository } from '../repository/report.repository';

export const ReportWriterServiceToken = 'ReportWriterServiceToken';

@Injectable()
export class ReportWriterService {
    constructor(
        private readonly reportRepository: ReportRepository,

        @Inject(ShareSearcherServiceToken)
        private readonly shareSearcherService: ShareSearcherService,
        @Inject(UserSearcherServiceToken)
        private readonly userSearcherService: UserSearcherService,
    ) {}

    async createReport(reporter: string, dto: InputReportDTO) {
        await this.userSearcherService.findUserId(dto.reported);

        let isExistsType;

        switch (dto.type) {
            case '게시글':
                isExistsType = await this.shareSearcherService.findPost(dto.typeId);
                break;
            case '댓글':
                isExistsType = await this.shareSearcherService.findComment(dto.typeId);
                break;
            case '대댓글':
                isExistsType = await this.shareSearcherService.findCommentReply(dto.typeId);
                break;
            default:
                throw new CustomException('Invalid data for the specified type.', HttpStatus.BAD_REQUEST, -1000);
        }

        if (isExistsType?.userId !== dto.reported) {
            throw new CustomException('Invalid data for the specified reported user Id.', HttpStatus.BAD_REQUEST, -1000);
        }

        const report = await this.reportRepository.createReport({ ...dto, reporter });

        if (!report) {
            throw new CustomException('Failed to save report.', HttpStatus.INTERNAL_SERVER_ERROR, -1000);
        }

        return { message: 'Success' };
    }
}
