import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'bson';
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

    async createCommentReply(userId: string, replyInfo: InputShareCommentReplyDTO, session: ClientSession) {
        const reply = new this.shareCommentReplyModel({ ...replyInfo, userId });
        const savedReply = await reply.save({ session });
        return savedReply.Mapper();
    }

    async findCommentReplyIdWithUserId(commentReplyId: string, userId: string) {
        const shareCommentReply = await this.shareCommentReplyModel
            .findOne({ _id: new ObjectId(commentReplyId), userId: new ObjectId(userId) }, { _id: 1, commentId: 1 })
            .exec();
        return shareCommentReply?.Mapper();
    }

    async updateCommentReply(commentReplyId: string, userId: string, contents: string) {
        const response = await this.shareCommentReplyModel
            .updateOne({ _id: new ObjectId(commentReplyId), userId: new ObjectId(userId) }, { $set: { contents } })
            .exec();
        return response.modifiedCount;
    }

    async deleteShareCommentReply(commentReplyId: string, userId: string, session: ClientSession) {
        const response = await this.shareCommentReplyModel
            .updateOne(
                { _id: new ObjectId(commentReplyId), userId: new ObjectId(userId) },
                { $set: { isDeleted: true } },
                { session },
            )
            .exec();
        return response.modifiedCount;
    }

    async deleteManyShareCommentReply(commentId: string, session: ClientSession) {
        const response = await this.shareCommentReplyModel
            .updateMany({ commentId: new ObjectId(commentId) }, { $set: { isDeleted: true } }, { session })
            .exec();
        return response.modifiedCount;
    }

    async deleteManyShareCommentReplyByArrayCommentId(commentIds: string[], session: ClientSession) {
        const response = await this.shareCommentReplyModel
            .updateMany({ commentId: { $in: commentIds }, isDeleted: false }, { $set: { isDeleted: true } }, { session })
            .exec();
        return response.modifiedCount;
    }
}
