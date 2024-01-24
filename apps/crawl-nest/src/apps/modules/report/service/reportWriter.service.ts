import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InputReportUserBlockingDTO } from '../../../dto/report/blocking/input-reportUserBlocking.dto';
import { InputReportShareContentDTO, ReportShareContentType } from '../../../dto/report/share/input-reportShareContent.dto';
import { CustomException } from '../../../utils/error/customException';
import { ShareSearcherService, ShareSearcherServiceToken } from '../../share/service/shareSearcher.service';
import { UserSearcherService, UserSearcherServiceToken } from '../../user/service/userSearcher.service';
import { ReportShareContentRepository } from '../repository/reportShareContent.repository';
import { ReportUserBlockingRepository } from '../repository/reportUserBlocking.repository';

export const ReportWriterServiceToken = 'ReportWriterServiceToken';

@Injectable()
export class ReportWriterService {
    constructor(
        private readonly reportShareContentRepository: ReportShareContentRepository,
        private readonly reportUserBlockingRepository: ReportUserBlockingRepository,

        @Inject(ShareSearcherServiceToken)
        private readonly shareSearcherService: ShareSearcherService,
        @Inject(UserSearcherServiceToken)
        private readonly userSearcherService: UserSearcherService,
    ) {}

    async createReportShareContent(reporter: string, dto: InputReportShareContentDTO) {
        await this.userSearcherService.findUserId(dto.reported);

        let isExistsType;

        switch (dto.type) {
            case ReportShareContentType.POST:
                isExistsType = await this.shareSearcherService.findPost(dto.typeId);
                break;
            case ReportShareContentType.COMMENT:
                isExistsType = await this.shareSearcherService.findComment(dto.typeId);
                break;
            case ReportShareContentType.REPLY:
                isExistsType = await this.shareSearcherService.findCommentReply(dto.typeId);
                break;
            default:
                throw new CustomException('Invalid data for the specified type.', HttpStatus.UNPROCESSABLE_ENTITY, -6502);
        }

        if (isExistsType?.userId !== dto.reported) {
            throw new CustomException('Invalid data for the specified reported user Id.', HttpStatus.BAD_REQUEST, -6001);
        }

        const report = await this.reportShareContentRepository.createReportShareContent({ ...dto, reporter });

        if (!report) {
            throw new CustomException('Failed to save report share content.', HttpStatus.INTERNAL_SERVER_ERROR, -6601);
        }

        return { message: 'Success' };
    }

    async createReportUserBlocking(blocker: string, nickname: string) {
        const blocked = (await this.userSearcherService.findNickname(nickname)).id as string;

        const dto: InputReportUserBlockingDTO = { blocker, blocked };
        const blocking = await this.reportUserBlockingRepository.createReportUserBlocking(dto);

        if (!blocking) {
            throw new CustomException('Failed to save report user blocking.', HttpStatus.INTERNAL_SERVER_ERROR, -6602);
        }

        return { message: 'Success' };
    }
}
