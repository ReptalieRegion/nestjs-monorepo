import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { UserActivityType } from '@private-crawl/types';
import mongoose, { ClientSession } from 'mongoose';
import { ImageType } from '../../../dto/image/input-image.dto';
import { CustomException } from '../../../utils/error/customException';
import { CustomExceptionHandler } from '../../../utils/error/customException.handler';
import { ImageDeleterService, ImageDeleterServiceToken } from '../../image/service/imageDeleter.service';
import { UserActivityLogService, UserActivityLogServiceToken } from '../../user-activity-log/userActivityLog.service';
import { ShareCommentRepository } from '../repository/shareComment.repository';
import { ShareCommentReplyRepository } from '../repository/shareCommentReply.repository';
import { ShareLikeRepository } from '../repository/shareLike.repository';
import { SharePostRepository } from '../repository/sharePost.repository';
import { ShareSearcherService, ShareSearcherServiceToken } from './shareSearcher.service';

export const ShareDeleterServiceToken = 'ShareDeleterServiceToken';

@Injectable()
export class ShareDeleterService {
    constructor(
        @InjectConnection()
        private readonly connection: mongoose.Connection,

        private readonly sharePostRepository: SharePostRepository,
        private readonly shareCommentRepository: ShareCommentRepository,
        private readonly shareCommentReplyRepository: ShareCommentReplyRepository,
        private readonly shareLikeRepository: ShareLikeRepository,

        @Inject(ShareSearcherServiceToken)
        private readonly shareSearcherService: ShareSearcherService,
        @Inject(ImageDeleterServiceToken)
        private readonly imageDeleterService: ImageDeleterService,

        @Inject(UserActivityLogServiceToken)
        private readonly userActivityLogService: UserActivityLogService,
    ) {}

    /**
     * 게시물을 삭제합니다.
     *
     * @param userId - 현재 사용자의 ID입니다.
     * @param postId - 삭제할 게시물의 ID입니다.
     * @returns 삭제된 게시물 정보를 반환합니다.
     */
    async deletePost(userId: string, postId: string) {
        const session: ClientSession = await this.connection.startSession();
        session.startTransaction();

        try {
            const result = await this.sharePostRepository
                .updateOne({ _id: postId, userId, isDeleted: false }, { $set: { isDeleted: true } }, { session })
                .exec();

            if (result.modifiedCount === 0) {
                throw new CustomException('Failed to delete share post.', HttpStatus.INTERNAL_SERVER_ERROR, -2609);
            }

            await Promise.all([
                this.imageDeleterService.deleteImageByTypeId(ImageType.Share, [postId], session),
                this.deleteLike(postId, session),
            ]);

            const commentIds = await this.shareSearcherService.getCommentIds([postId]);

            if (commentIds.length) {
                const commentResult = await this.shareCommentRepository
                    .updateMany({ postId, isDeleted: false }, { $set: { isDeleted: true } }, { session })
                    .exec();

                if (commentResult.modifiedCount === 0) {
                    throw new CustomException('Failed to delete share comment.', HttpStatus.INTERNAL_SERVER_ERROR, -2610);
                }

                await this.shareCommentReplyRepository
                    .updateMany(
                        { commentId: { $in: commentIds }, isDeleted: false },
                        { $set: { isDeleted: true } },
                        { session },
                    )
                    .exec();
            }

            this.userActivityLogService.createActivityLog({
                userId,
                activityType: UserActivityType.POST_DELETED,
                details: JSON.stringify({ post: { id: postId } }),
            });
            await session.commitTransaction();
            return this.shareSearcherService.getPostInfo({ delete: { postId } });
        } catch (error) {
            await session.abortTransaction();
            throw new CustomExceptionHandler(error).handleException('Invalid ObjectId for share post Id.', -2504);
        } finally {
            await session.endSession();
        }
    }

    /**
     * 댓글을 삭제합니다.
     *
     * @param userId - 현재 사용자의 ID입니다.
     * @param commentId - 삭제할 댓글의 ID입니다.
     * @returns 삭제된 댓글 정보를 반환합니다.
     */
    async deleteComment(userId: string, commentId: string) {
        const session: ClientSession = await this.connection.startSession();
        session.startTransaction();

        try {
            const result = await this.shareCommentRepository
                .updateOne({ _id: commentId, userId, isDeleted: false }, { $set: { isDeleted: true } }, { session })
                .exec();

            if (result.modifiedCount === 0) {
                throw new CustomException('Failed to delete share comment.', HttpStatus.INTERNAL_SERVER_ERROR, -2610);
            }

            const isReplyCount = await this.shareSearcherService.getCommentReplyAllCount(commentId);

            if (isReplyCount) {
                const replyResult = await this.shareCommentReplyRepository
                    .updateMany({ commentId, isDeleted: false }, { $set: { isDeleted: true } }, { session })
                    .exec();

                if (replyResult.modifiedCount === 0) {
                    throw new CustomException('Failed to delete share comment reply.', HttpStatus.INTERNAL_SERVER_ERROR, -2611);
                }
            }

            this.shareCommentRepository
                .findById(commentId)
                .exec()
                .then((comment) => {
                    this.userActivityLogService.createActivityLog({
                        userId,
                        activityType: UserActivityType.COMMENT_DELETED,
                        details: JSON.stringify({
                            post: { id: comment?.postId },
                            comment: { id: comment?.id },
                        }),
                    });
                });

            this.userActivityLogService.createActivityLog({ userId, activityType: UserActivityType.COMMENT_DELETED });
            await session.commitTransaction();
            return this.shareSearcherService.getCommentInfo({ delete: { commentId } });
        } catch (error) {
            await session.abortTransaction();
            throw new CustomExceptionHandler(error).handleException('Invalid ObjectId for share comment Id.', -2505);
        } finally {
            await session.endSession();
        }
    }

    /**
     * 댓글 답글을 삭제합니다.
     *
     * @param userId - 현재 사용자의 ID입니다.
     * @param commentReplyId - 삭제할 댓글 답글의 ID입니다.
     * @returns 삭제된 댓글 답글 정보를 반환합니다.
     */
    async deleteCommentReply(userId: string, commentReplyId: string) {
        try {
            const result = await this.shareCommentReplyRepository
                .updateOne({ _id: commentReplyId, userId, isDeleted: false }, { $set: { isDeleted: true } })
                .exec();

            if (result.modifiedCount === 0) {
                throw new CustomException('Failed to delete share comment reply.', HttpStatus.INTERNAL_SERVER_ERROR, -2611);
            }

            this.shareCommentReplyRepository
                .findById(commentReplyId)
                .exec()
                .then((commentReply) => {
                    this.userActivityLogService.createActivityLog({
                        userId,
                        activityType: UserActivityType.REPLY_COMMENT_DELETED,
                        details: JSON.stringify({
                            comment: { id: commentReply?.commentId },
                            commentReply: { id: commentReply?.id },
                        }),
                    });
                });
            return this.shareSearcherService.getCommentReplyInfo({ delete: { commentReplyId } });
        } catch (error) {
            throw new CustomExceptionHandler(error).handleException('Invalid ObjectId for share comment reply Id.', -2506);
        }
    }

    /**
     * 게시물에 대한 좋아요 정보를 삭제합니다.
     *
     * @param postId - 게시물의 ID입니다.
     * @param session - 현재 세션입니다.
     */
    async deleteLike(postId: string, session: ClientSession) {
        const isLikeCount = await this.shareSearcherService.getLikeAllCount(postId);

        if (isLikeCount) {
            const result = await this.shareLikeRepository
                .updateMany({ postId, isCanceled: false }, { $set: { isCanceled: true } }, { session })
                .exec();

            if (result.modifiedCount === 0) {
                throw new CustomException('Failed to delete share like.', HttpStatus.INTERNAL_SERVER_ERROR, -2612);
            }
        }
    }

    async withdrawalShareInfo(userId: string, session: ClientSession) {
        const postIds = await this.shareSearcherService.getPostIds(userId);

        if (postIds.length) {
            const commentIds = await this.shareSearcherService.getCommentIds(postIds);

            await this.sharePostRepository.withdrawalPost({ userId, isDeleted: false }, session);
            await this.imageDeleterService.deleteImageByTypeId(ImageType.Share, postIds, session);
            await this.shareLikeRepository.withdrawalLike(
                { postId: { $in: postIds }, userId: { $ne: userId }, isCanceled: false },
                session,
            );

            if (commentIds.length) {
                await this.shareCommentRepository.withdrawalComment(
                    { postId: { $in: postIds }, userId: { $ne: userId }, isDeleted: false },
                    session,
                );

                await this.shareCommentReplyRepository.withdrawalCommentReply(
                    { commentId: { $in: commentIds }, userId: { $ne: userId }, isDeleted: false },
                    session,
                );
            }
        }

        await this.shareCommentRepository.withdrawalComment({ userId, isDeleted: false }, session);
        await this.shareCommentReplyRepository.withdrawalCommentReply({ userId, isDeleted: false }, session);
        await this.shareLikeRepository.withdrawalLike({ userId, isCanceled: false }, session);
    }
}
