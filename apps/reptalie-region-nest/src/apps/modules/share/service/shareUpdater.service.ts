import { BadRequestException, Injectable } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { ShareCommentRepository } from '../repository/shareComment.repository';

export const ShareUpdaterServiceToken = 'ShareUpdaterServiceToken';

@Injectable()
export class ShareUpdaterService {
    constructor(private readonly shareCommentRepository: ShareCommentRepository) {}

    async incrementReplyCount(id: string, session: ClientSession) {
        const result = await this.shareCommentRepository.incrementReplyCount(id, session);

        if (result === 0) {
            throw new BadRequestException('ReplyCount increment Failed');
        }
    }
}
