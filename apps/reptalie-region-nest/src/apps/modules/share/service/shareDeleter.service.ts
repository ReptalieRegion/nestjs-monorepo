import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { ClientSession } from 'mongoose';
import { ImageType } from '../../../dto/image/input-image.dto';
import { ImageDeleterService, ImageDeleterServiceToken } from '../../image/service/imageDeleter.service';
import { ShareCommentRepository } from '../repository/shareComment.repository';
import { ShareCommentReplyRepository } from '../repository/shareCommentReply.repository';
import { SharePostRepository } from '../repository/sharePost.repository';
import { ShareSearcherService, ShareSearcherServiceToken } from './shareSearcher.service';
import { ShareUpdaterService, ShareUpdaterServiceToken } from './shareUpdater.service';

export const ShareDeleterServiceToken = 'ShareDeleterServiceToken';

@Injectable()
export class ShareDeleterService {
    constructor(
        @InjectConnection()
        private readonly connection: mongoose.Connection,

        private readonly sharePostRepository: SharePostRepository,
        private readonly shareCommentRepository: ShareCommentRepository,
        private readonly shareCommentReplyRepository: ShareCommentReplyRepository,

        @Inject(ShareSearcherServiceToken)
        private readonly shareSearcherService: ShareSearcherService,
        @Inject(ShareUpdaterServiceToken)
        private readonly shareUpdaterService: ShareUpdaterService,
        @Inject(ImageDeleterServiceToken)
        private readonly imageDeleterService: ImageDeleterService,
    ) {}

    async deletePost(userId: string, postId: string) {
        const session: ClientSession = await this.connection.startSession();
        session.startTransaction();

        try {
            await this.shareSearcherService.isExistsPostWithUserId(postId, userId);

            const deletePostResult = await this.sharePostRepository.deletePost(postId, userId, session);
            if (deletePostResult === 0) {
                throw new InternalServerErrorException('Failed to delete SharePost.');
            }

            await this.imageDeleterService.deleteImageByTypeId(ImageType.Share, postId, session);

            const commentIds = await this.shareSearcherService.findCommentIdsByPostId(postId);

            const deleteCommentResult = await this.shareCommentRepository.deleteManyShareComment(postId, session);
            if (deleteCommentResult === 0) {
                throw new InternalServerErrorException('Failed to delete ShareComment.');
            }
            if (commentIds) {
                const deleteCommentReplyResult = await this.shareCommentReplyRepository.deleteManyCommentReplyByCommentIds(
                    commentIds,
                    session,
                );
                if (deleteCommentReplyResult === 0) {
                    throw new InternalServerErrorException('Failed to delete ShareCommentReply.');
                }
            }

            await session.commitTransaction();
            return { post: { id: postId }, user: { id: userId } };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
    }

    async deleteComment(userId: string, commentId: string) {
        const session: ClientSession = await this.connection.startSession();
        session.startTransaction();

        try {
            const comment = await this.shareSearcherService.isExistsCommentWithUserId(commentId, userId);

            const deleteResult = await this.shareCommentRepository.deleteComment(commentId, userId, session);
            if (deleteResult === 0) {
                throw new InternalServerErrorException('Failed to delete ShareComment.');
            }

            if (comment?.replyCount) {
                await this.shareCommentReplyRepository.deleteManyCommentReply(commentId, session);
            }

            await session.commitTransaction();
            return { post: { id: comment?.postId }, comment: { id: commentId } };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
    }

    async deleteCommentReply(userId: string, commentReplyId: string) {
        const session: ClientSession = await this.connection.startSession();
        session.startTransaction();

        try {
            const commentReply = await this.shareSearcherService.isExistsCommentReplyWithUserId(commentReplyId, userId);

            const deleteResult = await this.shareCommentReplyRepository.deleteCommentReply(commentReplyId, userId, session);
            if (deleteResult === 0) {
                throw new InternalServerErrorException('Failed to delete ShareCommentReply.');
            }

            if (commentReply?.commentId) {
                await this.shareUpdaterService.decrementReplyCount(commentReply?.commentId, session);
            }

            await session.commitTransaction();
            return { comment: { id: commentReply?.commentId }, commentReply: { id: commentReplyId } };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
    }
}
