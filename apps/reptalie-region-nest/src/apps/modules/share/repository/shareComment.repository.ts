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

    async incrementReplyCountById(id: string, session: ClientSession) {
        const response = await this.shareCommentModel
            .updateOne({ _id: new ObjectId(id), isDeleted: false }, { $inc: { replyCount: 1 } }, { session })
            .exec();
        return response.modifiedCount;
    }

    async decrementReplyCountById(id: string, session: ClientSession) {
        const response = await this.shareCommentModel
            .updateOne({ _id: new ObjectId(id), isDeleted: false }, { $inc: { replyCount: -1 } }, { session })
            .exec();
        return response.modifiedCount;
    }

    async updateComment(commentId: string, userId: string, contents: string) {
        const response = await this.shareCommentModel
            .updateOne({ _id: new ObjectId(commentId), userId: new ObjectId(userId), isDeleted: false }, { $set: { contents } })
            .exec();
        return response.modifiedCount;
    }

    async deleteComment(commentId: string, userId: string, session: ClientSession) {
        const response = await this.shareCommentModel
            .updateOne(
                { _id: new ObjectId(commentId), userId: new ObjectId(userId), isDeleted: false },
                { $set: { isDeleted: true } },
                { session },
            )
            .exec();
        return response.modifiedCount;
    }

    async deleteManyShareComment(postId: string, session: ClientSession) {
        const response = await this.shareCommentModel
            .updateMany({ postId: new ObjectId(postId), isDeleted: false }, { $set: { isDeleted: true } }, { session })
            .exec();
        return response.modifiedCount;
    }

    async findCommentIdsByPostId(postId: string) {
        const commentIds = await this.shareCommentModel
            .find({ postId: new ObjectId(postId), isDeleted: false }, { _id: 1 })
            .exec();
        return commentIds.map((entity) => entity.Mapper());
    }

    async findCommentWithUserId(commentId: string, userId: string) {
        const shareComment = await this.shareCommentModel
            .findOne(
                { _id: new ObjectId(commentId), userId: new ObjectId(userId), isDeleted: false },
                { _id: 1, postId: 1, replyCount: 1 },
            )
            .exec();
        return shareComment?.Mapper();
    }

    async findCommentsForInfiniteScroll(postId: string, pageParams: number, limitSize: number) {
        const comments = await this.shareCommentModel
            .find({ postId: new ObjectId(postId), isDeleted: false })
            .populate({ path: 'userId', select: '_id nickname' })
            .sort({ createdAt: -1 }) 
            .skip(pageParams * limitSize)
            .limit(limitSize)
            .exec();

        const isLastPage = comments.length < limitSize;

        return {
            comments: comments.map((entity) => ({ ...entity.Mapper(), userId: entity.userId.Mapper() })),
            isLastPage: isLastPage,
            pageParams: pageParams + 1,
        };
    }
}
