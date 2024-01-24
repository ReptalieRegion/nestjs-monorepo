import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { ClientSession, Model } from 'mongoose';

import { InputShareCommentDTO } from '../../../dto/share/comment/input-shareComment.dto';
import { ShareComment, ShareCommentDocument } from '../../../schemas/shareComment.schema';
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

    async withdrawalComment(query: mongoose.FilterQuery<ShareCommentDocument>, session: ClientSession) {
        await this.shareCommentModel.updateMany(query, { $set: { isDeleted: true } }, { session }).exec();
    }

    async restoreComment(oldUserId: string, newUserId: string, session: ClientSession) {
        await this.shareCommentModel
            .updateMany({ userId: oldUserId, isDeleted: true }, { $set: { userId: newUserId, isDeleted: false } }, { session })
            .exec();
    }
}
