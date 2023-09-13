import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { ClientSession } from 'mongoose';
import { InputShareCommentDTO } from '../../../dto/share/comment/input-shareComment.dto';
import { InputShareCommentReplyDTO } from '../../../dto/share/commentReply/input-shareCommentReply.dto';
import { InputSharePostDTO } from '../../../dto/share/post/input-sharePost.dto';
import { ImageDeleterService, ImageDeleterServiceToken } from '../../image/service/imageDeleter.service';
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
    ) {}

    async incrementReplyCount(id: string, session: ClientSession) {
        const result = await this.shareCommentRepository.incrementReplyCountById(id, session);
        if (result === 0) {
            throw new InternalServerErrorException('Failed to increment reply count for the comment.');
        }
    }

    async decrementReplyCount(id: string, session: ClientSession) {
        const result = await this.shareCommentRepository.decrementReplyCountById(id, session);
        if (result === 0) {
            throw new InternalServerErrorException('Failed to decrement reply count for the comment.');
        }
    }

    async toggleLike(userId: string, postId: string) {
        const like = await this.shareSearcherService.getLikeInfo(postId, userId);

        const result = await this.shareLikeRepository.updateLike(like.id, like.isCanceled);
        if (result === 0) {
            throw new InternalServerErrorException('Failed to toggle the like status.');
        }
    }

    async updatePost(userId: string, postId: string, inputSharePostDTO: InputSharePostDTO) {
        const session: ClientSession = await this.connection.startSession();
        session.startTransaction();

        try {
            await this.shareSearcherService.isExistsPostWithUserId(postId, userId);

            const updateResult = await this.sharePostRepository.updatePost(postId, userId, inputSharePostDTO.contents, session);

            if (updateResult === 0) {
                throw new InternalServerErrorException('Failed to update post.');
            }

            if (inputSharePostDTO.deletefiles) {
                await this.imageDeleterService.deleteImageByImageKeys(inputSharePostDTO.deletefiles, postId, session);
            }

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
    }

    async updateComment(userId: string, commentId: string, inputShareCommentDTO: InputShareCommentDTO) {
        await this.shareSearcherService.isExistsCommentWithUserId(commentId, userId);

        const updateResult = await this.shareCommentRepository.updateComment(commentId, userId, inputShareCommentDTO.contents);
        if (updateResult === 0) {
            throw new InternalServerErrorException('Failed to update comment.');
        }
    }

    async updateCommentReply(userId: string, commentReplyId: string, inputShareCommentReplyDTO: InputShareCommentReplyDTO) {
        await this.shareSearcherService.isExistsCommentReplyWithUserId(commentReplyId, userId);

        const updateResult = await this.shareCommnetReplyRepository.updateCommentReply(
            commentReplyId,
            userId,
            inputShareCommentReplyDTO.contents,
        );

        if (updateResult === 0) {
            throw new InternalServerErrorException('Failed to update commentReply.');
        }
    }
}
