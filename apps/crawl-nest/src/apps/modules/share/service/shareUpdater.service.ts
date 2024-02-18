import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { ClientSession } from 'mongoose';
import { ImageType } from '../../../dto/image/input-image.dto';
import { InputShareCommentDTO } from '../../../dto/share/comment/input-shareComment.dto';
import { InputShareCommentReplyDTO } from '../../../dto/share/commentReply/input-shareCommentReply.dto';
import { InputSharePostDTO } from '../../../dto/share/post/input-sharePost.dto';
import { IUserProfileDTO } from '../../../dto/user/user/user-profile.dto';
import { CustomException } from '../../../utils/error/customException';
import { CustomExceptionHandler } from '../../../utils/error/customException.handler';
import { ImageDeleterService, ImageDeleterServiceToken } from '../../image/service/imageDeleter.service';
import { ImageUpdaterService, ImageUpdaterServiceToken } from '../../image/service/imageUpdater.service';
import { ShareCommentRepository } from '../repository/shareComment.repository';
import { ShareCommentReplyRepository } from '../repository/shareCommentReply.repository';
import { ShareLikeRepository } from '../repository/shareLike.repository';
import { SharePostRepository } from '../repository/sharePost.repository';
import { ShareSearcherService, ShareSearcherServiceToken } from './shareSearcher.service';

export const ShareUpdaterServiceToken = 'ShareUpdaterServiceToken';

@Injectable()
export class ShareUpdaterService {
    constructor(
        @InjectConnection()
        private readonly connection: mongoose.Connection,

        private readonly sharePostRepository: SharePostRepository,
        private readonly shareLikeRepository: ShareLikeRepository,
        private readonly shareCommentRepository: ShareCommentRepository,
        private readonly shareCommentReplyRepository: ShareCommentReplyRepository,

        @Inject(ShareSearcherServiceToken)
        private readonly shareSearcherService: ShareSearcherService,
        @Inject(ImageDeleterServiceToken)
        private readonly imageDeleterService: ImageDeleterService,
        @Inject(ImageUpdaterServiceToken)
        private readonly imageUpdaterService: ImageUpdaterService,
    ) {}

    /**
     * 게시물을 업데이트합니다.
     *
     * @param user - 게시물을 업데이트하는 사용자입니다.
     * @param postId - 업데이트할 게시물의 ID입니다.
     * @param dto - 게시물의 업데이트 정보를 담고 있는 데이터 전송 객체입니다.
     * @returns 업데이트된 게시물 정보를 반환합니다.
     */
    async updatePost(user: IUserProfileDTO, postId: string, dto: InputSharePostDTO) {
        const session: ClientSession = await this.connection.startSession();
        session.startTransaction();

        try {
            const result = await this.sharePostRepository
                .updateOne(
                    { _id: postId, userId: user.id, isDeleted: false },
                    { $set: { contents: dto.contents } },
                    { session },
                )
                .exec();

            if (result.modifiedCount === 0) {
                throw new CustomException('Failed to update share post.', HttpStatus.INTERNAL_SERVER_ERROR, -2605);
            }

            if (dto.remainingImages) {
                const baseUrl = `${process.env.AWS_IMAGE_BASEURL}`;
                const deletefiles = dto.remainingImages.map((value) => value.slice(baseUrl.length));

                await this.imageDeleterService.deleteImageByImageKeys(deletefiles, postId, session);
            }

            await session.commitTransaction();

            const postInfo = await this.shareSearcherService.getPostInfo({ update: { postId } });
            return { post: { ...postInfo, user } };
        } catch (error) {
            await session.abortTransaction();
            throw new CustomExceptionHandler(error).handleException('Invalid ObjectId for share post Id.', -2504);
        } finally {
            await session.endSession();
        }
    }

    /**
     * 댓글을 업데이트합니다.
     *
     * @param user - 댓글을 업데이트하는 사용자입니다.
     * @param commentId - 업데이트할 댓글의 ID입니다.
     * @param dto - 댓글의 업데이트 정보를 담고 있는 데이터 전송 객체입니다.
     * @returns 업데이트된 댓글 정보를 반환합니다.
     */
    async updateComment(user: IUserProfileDTO, commentId: string, dto: InputShareCommentDTO) {
        try {
            const result = await this.shareCommentRepository
                .updateOne({ _id: commentId, userId: user.id, isDeleted: false }, { $set: { contents: dto.contents } })
                .exec();

            if (result.modifiedCount === 0) {
                throw new CustomException('Failed to update share comment.', HttpStatus.INTERNAL_SERVER_ERROR, -2606);
            }
        } catch (error) {
            throw new CustomExceptionHandler(error).handleException('Invalid ObjectId for share comment Id.', -2505);
        }

        const commentInfo = await this.shareSearcherService.getCommentInfo({ update: { commentId } });
        return { post: { ...commentInfo, user: { nickname: user.nickname } } };
    }

    /**
     * 댓글에 대한 답글을 업데이트합니다.
     *
     * @param userId - 답글을 업데이트하는 사용자의 ID입니다.
     * @param commentReplyId - 업데이트할 답글의 ID입니다.
     * @param dto - 답글의 업데이트 정보를 담고 있는 데이터 전송 객체입니다.
     * @returns 업데이트된 답글 정보를 반환합니다.
     */
    async updateCommentReply(userId: string, commentReplyId: string, dto: InputShareCommentReplyDTO) {
        try {
            const result = await this.shareCommentReplyRepository
                .updateOne({ _id: commentReplyId, userId, isDeleted: false }, { $set: { contents: dto.contents } })
                .exec();

            if (result.modifiedCount === 0) {
                throw new CustomException('Failed to update share comment reply.', HttpStatus.INTERNAL_SERVER_ERROR, -2607);
            }
        } catch (error) {
            throw new CustomExceptionHandler(error).handleException('Invalid ObjectId for share comment reply Id.', -2506);
        }

        const commentReplyInfo = await this.shareSearcherService.getCommentReplyInfo({ update: { commentReplyId } });
        return { comment: { ...commentReplyInfo } };
    }

    /**
     * 게시물에 대한 좋아요 상태를 전환합니다.
     *
     * @param userId - 좋아요 상태를 전환하는 사용자의 ID입니다.
     * @param postId - 좋아요 상태를 전환할 게시물의 ID입니다.
     * @returns 전환된 좋아요 상태를 반환합니다.
     */
    async toggleLike(userId: string, postId: string) {
        const likeStatus = await this.shareSearcherService.getLikeStatus(postId, userId);

        const result = await this.shareLikeRepository
            .updateOne({ _id: likeStatus?.id }, { $set: { isCanceled: !likeStatus?.isCanceled } })
            .exec();

        if (result.modifiedCount === 0) {
            throw new CustomException('Failed to toggle the share like status.', HttpStatus.INTERNAL_SERVER_ERROR, -2608);
        }

        return { post: { id: likeStatus?.postId.id, user: { nickname: likeStatus?.postId.userId.nickname } } };
    }

    async restoreShareInfo(oldUserId: string, newUserId: string, session: ClientSession) {
        const postIds = await this.shareSearcherService.getRestorePostIds(oldUserId);

        if (postIds.length) {
            const commentIds = await this.shareSearcherService.getRestoreCommentIds(postIds);

            await this.sharePostRepository.restorePost(oldUserId, newUserId, session);
            await this.imageUpdaterService.restoreImageByTypeId(ImageType.Share, postIds, session);
            await this.shareLikeRepository
                .updateMany(
                    { postId: { $in: postIds }, userId: { $ne: oldUserId }, isCanceled: true },
                    { $set: { isCanceled: false } },
                    { session },
                )
                .exec();

            if (commentIds.length) {
                await this.shareCommentRepository.updateMany(
                    { postId: { $in: postIds }, userId: { $ne: oldUserId }, isDeleted: false },
                    { $set: { isDeleted: false } },
                    { session },
                );

                await this.shareCommentReplyRepository.updateMany(
                    { commentId: { $in: commentIds }, userId: { $ne: oldUserId }, isDeleted: false },
                    { $set: { isDeleted: false } },
                    { session },
                );
            }
        }

        await this.shareCommentRepository.restoreComment(oldUserId, newUserId, session);
        await this.shareCommentReplyRepository.restoreCommentReply(oldUserId, newUserId, session);
        await this.shareLikeRepository.restoreLike(oldUserId, newUserId, session);
    }
}
