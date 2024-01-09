import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { ClientSession, Model } from 'mongoose';

import { InputShareCommentReplyDTO } from '../../../dto/share/commentReply/input-shareCommentReply.dto';
import { ShareCommentReply, ShareCommentReplyDocument } from '../../../schemas/shareCommentReply.schema';
import { BaseRepository } from '../../base/base.repository';

@Injectable()
export class ShareCommentReplyRepository extends BaseRepository<ShareCommentReplyDocument> {
    constructor(
        @InjectModel(ShareCommentReply.name) private readonly shareCommentReplyModel: Model<ShareCommentReplyDocument>,
    ) {
        super(shareCommentReplyModel);
    }

    async createCommentReply(userId: string, replyInfo: InputShareCommentReplyDTO) {
        const reply = new this.shareCommentReplyModel({ ...replyInfo, userId });
        const savedReply = await reply.save();
        return savedReply.Mapper();
    }

    async deleteCommentReply(query: mongoose.FilterQuery<ShareCommentReplyDocument>, session: ClientSession) {
        await this.shareCommentReplyModel.updateMany(query, { $set: { isDeleted: true } }, { session }).exec();
    }
}
