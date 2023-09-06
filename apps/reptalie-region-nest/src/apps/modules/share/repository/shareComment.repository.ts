import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'bson';
import { ClientSession, Model } from 'mongoose';

import { InputShareCommentDTO } from '../../../dto/share/comment/input-shareComment.dto';
import { ShareCommentDocument, ShareComment } from '../../../schemas/shareComment.schema';
import { BaseRepository } from '../../base/base.repository';

@Injectable()
export class ShareCommentRepository extends BaseRepository<ShareCommentDocument> {
    constructor(@InjectModel(ShareComment.name) private readonly shareCommentModel: Model<ShareCommentDocument>) {
        super(shareCommentModel);
    }

    async createComment(userId: string, commentInfo: InputShareCommentDTO) {
        const comment = new this.shareCommentModel({ ...commentInfo, userId });
        const savedComment = await comment.save();
        return savedComment.Mapper();
    }

    async findCommentIdWithReplyCountById(id: string) {
        const shareComment = await this.shareCommentModel.findOne({ _id: new Object(id) }, { _id: 1, replyCount: 1 }).exec();
        return shareComment?.Mapper();
    }

    async findCommentIdWithUserIdById(commentId: string, userId: string) {
        const shareComment = await this.shareCommentModel
            .findOne({ _id: new ObjectId(commentId), userId: new ObjectId(userId) }, { _id: 1 })
            .exec();
        return shareComment?.Mapper();
    }

    async updateComment(commentId: string, userId: string, contents: string) {
        const response = await this.shareCommentModel
            .updateOne({ _id: new ObjectId(commentId), userId: new ObjectId(userId) }, { $set: { contents } })
            .exec();
        return response.modifiedCount;
    }

    async incrementReplyCount(id: string, session: ClientSession) {
        const response = await this.shareCommentModel
            .updateOne({ _id: new ObjectId(id) }, { $inc: { replyCount: 1 } }, { session })
            .exec();
        return response.modifiedCount;
    }
}
