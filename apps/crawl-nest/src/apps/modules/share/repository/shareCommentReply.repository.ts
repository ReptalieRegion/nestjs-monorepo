import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ShareCommentReply, ShareCommentReplyDocument } from '@private-crawl/models';
import mongoose, { ClientSession, Model } from 'mongoose';

import { InputShareCommentReplyDTO } from '../../../dto/share/commentReply/input-shareCommentReply.dto';
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

    async withdrawalCommentReply(query: mongoose.FilterQuery<ShareCommentReplyDocument>, session: ClientSession) {
        await this.shareCommentReplyModel.updateMany(query, { $set: { isDeleted: true } }, { session }).exec();
    }

    async restoreCommentReply(oldUserId: string, newUserId: string, session: ClientSession) {
        await this.shareCommentReplyModel
            .updateMany({ userId: oldUserId, isDeleted: true }, { $set: { userId: newUserId, isDeleted: false } }, { session })
            .exec();
    }
}
