import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { ClientSession } from 'mongoose';
import { InputShareCommentDTO } from '../../../dto/share/comment/input-shareComment.dto';
import { InputShareCommentReplyDTO } from '../../../dto/share/commentReply/input-shareCommentReply.dto';
import { InputSharePostDTO } from '../../../dto/share/post/input-sharePost.dto';
import { IResponseUserDTO } from '../../../dto/user/response-user.dto';
import { handleBSONAndCastError } from '../../../utils/error/errorHandler';
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
            const userInfo = await this.userSearcherService.getUserInfo({ user: { targetUserId: user.id } });

            const result = await this.sharePostRepository
                .updateOne(
                    { _id: postId, userId: user.id, isDeleted: false },
                    { $set: { contents: dto.contents } },
                    { session },
                )
                .exec();

            if (result.modifiedCount === 0) {
                throw new InternalServerErrorException('Failed to update post.');
            }

            if (dto.deletefiles) {
                await this.imageDeleterService.deleteImageByImageKeys(dto.deletefiles, postId, session);
            }

            await session.commitTransaction();

            const postInfo = await this.shareSearcherService.getPostInfo({ update: { postId } });
            return { user: userInfo, post: postInfo };
        } catch (error) {
            await session.abortTransaction();
            handleBSONAndCastError(error, 'share post Id Invalid ObjectId');
        } finally {
            await session.endSession();
        }
    }

    async updateComment(userId: string, commentId: string, dto: InputShareCommentDTO) {
        try {
            const result = await this.shareCommentRepository
                .updateOne({ _id: commentId, userId, isDeleted: false }, { $set: { contents: dto.contents } })
                .exec();

            if (result.modifiedCount === 0) {
                throw new InternalServerErrorException('Failed to update comment.');
            }
        } catch (error) {
            handleBSONAndCastError(error, 'share comment Id Invalid ObjectId');
        }

        return this.shareSearcherService.getCommentInfo({ update: { commentId } });
    }

    async updateCommentReply(userId: string, commentReplyId: string, dto: InputShareCommentReplyDTO) {
        try {
            const result = await this.shareCommnetReplyRepository
                .updateOne({ _id: commentReplyId, userId, isDeleted: false }, { $set: { contents: dto.contents } })
                .exec();

            if (result.modifiedCount === 0) {
                throw new InternalServerErrorException('Failed to update commentReply.');
            }
        } catch (error) {
            handleBSONAndCastError(error, 'share comment reply Id Invalid ObjectId');
        }

        return this.shareSearcherService.getCommentReplyInfo({ update: { commentReplyId } });
    }

    async toggleLike(userId: string, postId: string) {
        const like = await this.shareSearcherService.getLikeInfo(postId, userId);

        const result = await this.shareLikeRepository.updateOne({ _id: like?.id }, { $set: { isCanceled: !like?.isCanceled } });
        if (result.modifiedCount === 0) {
            throw new InternalServerErrorException('Failed to toggle the like status.');
        }

        return { post: { id: like?.postId } };
    }
}
