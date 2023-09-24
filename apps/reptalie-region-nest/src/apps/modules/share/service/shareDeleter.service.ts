import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { ClientSession } from 'mongoose';
import { ImageType } from '../../../dto/image/input-image.dto';
import { handleBSONAndCastError } from '../../../utils/error/errorHandler';
import { ImageDeleterService, ImageDeleterServiceToken } from '../../image/service/imageDeleter.service';
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
    ) {}

    async deletePost(userId: string, postId: string) {
        const session: ClientSession = await this.connection.startSession();
        session.startTransaction();

        try {
            const result = await this.sharePostRepository
                .updateOne({ _id: postId, userId, isDeleted: false }, { $set: { isDeleted: true } }, { session })
                .exec();

            if (result.modifiedCount === 0) {
                throw new InternalServerErrorException('Failed to delete share post.');
            }

            await Promise.all([
                this.imageDeleterService.deleteImageByTypeId(ImageType.Share, postId, session),
                this.deleteLike(postId, session),
            ]);

            const comments = await this.shareSearcherService.getComments(postId);

            if (comments.length) {
                const commentResult = await this.shareCommentRepository
                    .updateMany({ postId, isDeleted: false }, { $set: { isDeleted: true } }, { session })
                    .exec();

                if (commentResult.modifiedCount === 0) {
                    throw new InternalServerErrorException('Failed to delete share comment.');
                }

                await this.shareCommentReplyRepository
                    .updateMany({ commentId: { $in: comments }, isDeleted: false }, { $set: { isDeleted: true } }, { session })
                    .exec();
            }

            await session.commitTransaction();
            return  this.shareSearcherService.getPostInfo({ delete: { postId } });
        } catch (error) {
            await session.abortTransaction();
            handleBSONAndCastError(error, 'share post Id Invalid ObjectId');
        } finally {
            await session.endSession();
        }
    }

    async deleteComment(userId: string, commentId: string) {
        const session: ClientSession = await this.connection.startSession();
        session.startTransaction();

        try {
            const result = await this.shareCommentRepository
                .updateOne({ _id: commentId, userId, isDeleted: false }, { $set: { isDeleted: true } }, { session })
                .exec();

            if (result.modifiedCount === 0) {
                throw new InternalServerErrorException('Failed to delete share comment.');
            }

            const isReplyCount = await this.shareSearcherService.getCommentReplyCount(commentId);

            if (isReplyCount) {
                const replyResult = await this.shareCommentReplyRepository
                    .updateMany({ commentId, isDeleted: false }, { $set: { isDeleted: true } }, { session })
                    .exec();

                if (replyResult.modifiedCount === 0) {
                    throw new InternalServerErrorException('Failed to delete share comment reply.');
                }
            }

            await session.commitTransaction();
            return this.shareSearcherService.getCommentInfo({ delete: { commentId } });
        } catch (error) {
            await session.abortTransaction();
            handleBSONAndCastError(error, 'share comment Id Invalid ObjectId');
        } finally {
            await session.endSession();
        }
    }

    async deleteCommentReply(userId: string, commentReplyId: string) {
        try {
            const result = await this.shareCommentReplyRepository
                .updateOne({ _id: commentReplyId, userId, isDeleted: false }, { $set: { isDeleted: true } })
                .exec();

            if (result.modifiedCount === 0) {
                throw new InternalServerErrorException('Failed to delete share comment reply.');
            }
        } catch (error) {
            handleBSONAndCastError(error, 'share comment reply Id Invalid ObjectId');
        }

        return this.shareSearcherService.getCommentReplyInfo({ delete: { commentReplyId } });
    }

    async deleteLike(postId: string, session: ClientSession) {
        const isLikeCount = await this.shareSearcherService.getLikeCount(postId);

        if (isLikeCount) {
            const result = await this.shareLikeRepository
                .updateMany({ postId, isCanceled: false }, { $set: { isCanceled: true } }, { session })
                .exec();

            if (result.modifiedCount === 0) {
                throw new InternalServerErrorException('Failed to delete share like.');
            }
        }
    }
}
