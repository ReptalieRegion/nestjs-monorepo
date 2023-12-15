import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InputReportDTO } from '../../../dto/report/input-report.dto';
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
                throw new BadRequestException('Invalid data for the specified type.');
        }

        if (isExistsType?.userId !== dto.reported) {
            throw new BadRequestException('Invalid data for the specified reported user Id.');
        }

        const report = await this.reportRepository.createReport({ ...dto, reporter });

        if (!report) {
            throw new InternalServerErrorException('Failed to save report.');
        }

        return { message: 'Success' };
    }
}
