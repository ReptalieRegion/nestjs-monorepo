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

    async createComment(commentInfo: InputShareCommentDTO, session: ClientSession) {
        const comment = new this.shareCommentModel(commentInfo);
        const savedComment = await comment.save({ session });
        return savedComment.Mapper();
    }

    async findCommentIdWithReplyCountById(id: string) {
        const shareComment = await this.shareCommentModel.findOne({ _id: new Object(id) }, { _id: 1, replyCount: 1 }).exec();
        return shareComment?.Mapper();
    }

    async incrementReplyCount(id: string, session: ClientSession) {
        const response = await this.shareCommentModel.updateOne(
            { _id: new ObjectId(id) },
            { $inc: { replyCount: 1 } },
            { session },
        );

        return response.modifiedCount;
    }
}
