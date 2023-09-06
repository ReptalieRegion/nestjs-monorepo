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

    async isExistsPostId(postId: string) {
        try {
            const sharePost = await this.sharePostRepository.findPostIdById(postId);

            if (!sharePost) {
                throw new NotFoundException('SharePostId does not exist');
            }

            return sharePost;
        } catch (error) {
            handleBSONAndCastError(error, 'SharePostId Invalid ObjectId');
        }
    }

    async isExistsCommentId(id: string) {
        try {
            const shareComment = await this.shareCommentRepository.findCommentIdWithReplyCountById(id);

            if (!shareComment) {
                throw new NotFoundException('ShareCommentId does not exist');
            }

            return shareComment;
        } catch (error) {
            handleBSONAndCastError(error, 'ShareCommentId Invalid ObjectId');
        }
    }

    async getLikeStatus(postId: string, userId: string) {
        await this.isExistsPostId(postId);

        const like = await this.shareLikeRepository.findPostIdWithUserIdByIsCancled(userId, postId);

        if (!like || !like?.id || like?.isCancled === undefined) {
            throw new NotFoundException('Like status not found for the specified user and post.');
        }

        return { id: like.id, isCancled: like.isCancled };
    }

    async isExistsPostIdWithUserId(postId: string, userId: string) {
        try {
            const post = await this.sharePostRepository.findPostIdWithUserIdById(postId, userId);

            if (!post) {
                throw new NotFoundException('Post not found for the specified user and post id.');
            }

            return post;
        } catch (error) {
            handleBSONAndCastError(error, 'SharePostId Invalid ObjectId');
        }
    }

    async isExistsCommentIdWithUserId(commentId: string, userId: string) {
        try {
            const comment = await this.shareCommentRepository.findCommentIdWithUserIdById(commentId, userId);

            if (!comment) {
                throw new NotFoundException('Comment not found for the specified user and comment id.');
            }

            return comment;
        } catch (error) {
            handleBSONAndCastError(error, 'ShareCommentId Invalid ObjectId');
        }
    }

    async isExistsCommentReplyIdWithUserID(commentReplyId: string, userId: string) {
        try {
            const commentReply = await this.shareCommentReplyRepository.findCommentReplyIdWithUserIdById(
                commentReplyId,
                userId,
            );

            if (!commentReply) {
                throw new NotFoundException('CommentReply not found for the specified user and commentReply id.');
            }

            return commentReply;
        } catch (error) {
            handleBSONAndCastError(error, 'ShareCommentReplyId Invalid ObjectId');
        }
    }
}
