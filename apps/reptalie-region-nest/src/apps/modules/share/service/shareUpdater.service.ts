import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { ClientSession } from 'mongoose';
import { InputShareCommentDTO } from '../../../dto/share/comment/input-shareComment.dto';
import { InputShareCommentReplyDTO } from '../../../dto/share/commentReply/input-shareCommentReply.dto';
import { InputSharePostDTO } from '../../../dto/share/post/input-sharePost.dto';
import { IResponseUserDTO } from '../../../dto/user/response-user.dto';
import { serviceErrorHandler } from '../../../utils/error/errorHandler';
import { ImageDeleterService, ImageDeleterServiceToken } from '../../image/service/imageDeleter.service';
import { UserSearcherService, UserSearcherServiceToken } from '../../user/service/userSearcher.service';
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
        private readonly shareCommnetReplyRepository: ShareCommentReplyRepository,

        @Inject(ShareSearcherServiceToken)
        private readonly shareSearcherService: ShareSearcherService,
        @Inject(ImageDeleterServiceToken)
        private readonly imageDeleterService: ImageDeleterService,
        @Inject(UserSearcherServiceToken)
        private readonly userSearcherService: UserSearcherService,
    ) {}

    async updatePost(user: IResponseUserDTO, postId: string, dto: InputSharePostDTO) {
        const session: ClientSession = await this.connection.startSession();
        session.startTransaction();

        try {
            // 추후 user관련 구현 후 삭제할 예정
            const userInfo = await this.userSearcherService.getUserInfo({ targetUserId: user.id });

            const result = await this.sharePostRepository
                .updateOne(
                    { _id: postId, userId: user.id, isDeleted: false },
                    { $set: { contents: dto.contents } },
                    { session },
                )
                .exec();

            if (result.modifiedCount === 0) {
                throw new InternalServerErrorException('Failed to update share post.');
            }

            if (dto.remainingImages) {
                const baseUrl = `${process.env.AWS_IMAGE_BASEURL}`;
                const deletefiles = dto.remainingImages.map((value) => value.slice(baseUrl.length));

                await this.imageDeleterService.deleteImageByImageKeys(deletefiles, postId, session);
            }

            await session.commitTransaction();

            const postInfo = await this.shareSearcherService.getPostInfo({ update: { postId } });
            return { post: { ...postInfo, user: userInfo } };
        } catch (error) {
            await session.abortTransaction();
            serviceErrorHandler(error, 'Invalid ObjectId for share post Id.');
        } finally {
            await session.endSession();
        }
    }

    async updateComment(user: IResponseUserDTO, commentId: string, dto: InputShareCommentDTO) {
        try {
            const result = await this.shareCommentRepository
                .updateOne({ _id: commentId, userId: user.id, isDeleted: false }, { $set: { contents: dto.contents } })
                .exec();

            if (result.modifiedCount === 0) {
                throw new InternalServerErrorException('Failed to update share comment.');
            }
        } catch (error) {
            serviceErrorHandler(error, 'Invalid ObjectId for share comment Id.');
        }

        const commentInfo = await this.shareSearcherService.getCommentInfo({ update: { commentId } });
        return { post: { ...commentInfo, user: { nickname: user.nickname } } };
    }

    async updateCommentReply(userId: string, commentReplyId: string, dto: InputShareCommentReplyDTO) {
        try {
            const result = await this.shareCommnetReplyRepository
                .updateOne({ _id: commentReplyId, userId, isDeleted: false }, { $set: { contents: dto.contents } })
                .exec();

            if (result.modifiedCount === 0) {
                throw new InternalServerErrorException('Failed to update share comment reply.');
            }
        } catch (error) {
            serviceErrorHandler(error, 'Invalid ObjectId for share comment reply Id.');
        }

        const commentReplyInfo = await this.shareSearcherService.getCommentReplyInfo({ update: { commentReplyId } });
        return { comment: { ...commentReplyInfo } };
    }

    async toggleLike(userId: string, postId: string) {
        const likeStatus = await this.shareSearcherService.getLikeStatus(postId, userId);

        const result = await this.shareLikeRepository
            .updateOne({ _id: likeStatus?.id }, { $set: { isCanceled: !likeStatus?.isCanceled } })
            .exec();

        if (result.modifiedCount === 0) {
            throw new InternalServerErrorException('Failed to toggle the share like status.');
        }

        return { post: { id: likeStatus?.postId.id, user: { nickname: likeStatus?.postId.userId.nickname } } };
    }
}
