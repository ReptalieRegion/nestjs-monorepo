import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';

import { InputShareCommentReplyDTO } from '../../../dto/share/commentReply/input-shareCommentReply.dto';
import { ShareCommentReplyDocument, ShareCommentReply } from '../../../schemas/shareCommentReply.schema';
import { BaseRepository } from '../../base/base.repository';

@Injectable()
export class ShareCommentReplyRepository extends BaseRepository<ShareCommentReplyDocument> {
    constructor(
        @InjectModel(ShareCommentReply.name) private readonly shareCommentReplyModel: Model<ShareCommentReplyDocument>,
    ) {
        super(shareCommentReplyModel);
    }

    async createCommentReply(replyInfo: InputShareCommentReplyDTO, session: ClientSession) {
        const reply = new this.shareCommentReplyModel(replyInfo);
        const savedReply = await reply.save({ session });
        return savedReply.Mapper();
    }
}
