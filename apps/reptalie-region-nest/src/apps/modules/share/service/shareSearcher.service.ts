import { Injectable, NotFoundException } from '@nestjs/common';
import { handleBSONAndCastError } from '../../../utils/error/errorHandler';
import { ShareCommentRepository } from '../repository/shareComment.repository';
import { ShareCommentReplyRepository } from '../repository/shareCommentReply.repository';
import { ShareLikeRepository } from '../repository/shareLike.repository';
import { SharePostRepository } from '../repository/sharePost.repository';

export const ShareSearcherServiceToken = 'ShareSearcherServiceToken';

@Injectable()
export class ShareSearcherService {
    constructor(
        private readonly sharePostRepository: SharePostRepository,
        private readonly shareCommentRepository: ShareCommentRepository,
        private readonly shareCommentReplyRepository: ShareCommentReplyRepository,
        private readonly shareLikeRepository: ShareLikeRepository,
    ) {}

    async isExistsPostWithUserId(postId: string, userId: string) {
        try {
            const post = await this.sharePostRepository.findPostWithUserId(postId, userId);

            if (!post) {
                throw new NotFoundException('Post not found for the specified user and post id.');
            }

            return post;
        } catch (error) {
            handleBSONAndCastError(error, 'SharePostId Invalid ObjectId');
        }
    }

    async isExistsCommentWithUserId(commentId: string, userId: string) {
        try {
            const comment = await this.shareCommentRepository.findCommentWithUserId(commentId, userId);

            if (!comment) {
                throw new NotFoundException('Comment not found for the specified user and comment id.');
            }

            return comment;
        } catch (error) {
            handleBSONAndCastError(error, 'ShareCommentId Invalid ObjectId');
        }
    }

    async isExistsCommentReplyWithUserId(commentReplyId: string, userId: string) {
        try {
            const commentReply = await this.shareCommentReplyRepository.findCommentReplyWithUserId(commentReplyId, userId);

            if (!commentReply) {
                throw new NotFoundException('CommentReply not found for the specified user and commentReply id.');
            }

            return commentReply;
        } catch (error) {
            handleBSONAndCastError(error, 'ShareCommentReplyId Invalid ObjectId');
        }
    }

    async getLikeInfo(postId: string, userId: string) {
        await this.isExistsPostWithUserId(postId, userId);

        const like = await this.shareLikeRepository.findLikeByIsCanceled(userId, postId);

        if (!like || !like?.id || like?.isCanceled === undefined) {
            throw new NotFoundException('Like status not found for the specified user and post.');
        }

        return { id: like.id, isCanceled: like.isCanceled };
    }

    async findCommentIdsByPostId(postId: string) {
        try {
            const comment = await this.shareCommentRepository.findCommentIdsByPostId(postId);

            if (!comment) {
                throw new NotFoundException('Comment not found for the specified post id.');
            }

            return comment.map((entity) => entity.id as string);
        } catch (error) {
            handleBSONAndCastError(error, 'postId Invalid ObjectId');
        }
    }

    async getUserPostCount(userId: string) {
        return this.sharePostRepository.countDocuments({ userId: userId }).exec();
    }
}
