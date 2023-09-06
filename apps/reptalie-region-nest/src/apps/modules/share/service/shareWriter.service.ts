import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { ClientSession } from 'mongoose';
import { ImageType } from '../../../dto/image/input-image.dto';
import { InputShareCommentDTO } from '../../../dto/share/comment/input-shareComment.dto';
import { InputShareCommentReplyDTO } from '../../../dto/share/commentReply/input-shareCommentReply.dto';
import { InputShareLikeDTO } from '../../../dto/share/like/input-shareLike.dto';
import { InputSharePostDTO } from '../../../dto/share/post/input-sharePost.dto';
import { ImageS3HandlerServiceToken, ImageS3HandlerService } from '../../image/service/imageS3Handler.service';
import { ImageWriterServiceToken, ImageWriterService } from '../../image/service/imageWriter.service';
import { ShareCommentRepository } from '../repository/shareComment.repository';
import { ShareCommentReplyRepository } from '../repository/shareCommentReply.repository';
import { ShareLikeRepository } from '../repository/shareLike.repository';
import { SharePostRepository } from '../repository/sharePost.repository';
import { ShareSearcherService, ShareSearcherServiceToken } from './shareSearcher.service';
import { ShareUpdaterService, ShareUpdaterServiceToken } from './shareUpdater.service';

export const ShareWriterServiceToken = 'ShareWriterServiceToken';

@Injectable()
export class ShareWriterService {
    constructor(
        @InjectConnection()
        private readonly connection: mongoose.Connection,

        private readonly sharePostRepository: SharePostRepository,
        private readonly shareCommentRepository: ShareCommentRepository,
        private readonly shareCommentReplyRepository: ShareCommentReplyRepository,
        private readonly shareLikeRepository: ShareLikeRepository,

        @Inject(ShareUpdaterServiceToken)
        private readonly shareUpdaterService: ShareUpdaterService,
        @Inject(ShareSearcherServiceToken)
        private readonly shareSearcherService: ShareSearcherService,
        @Inject(ImageS3HandlerServiceToken)
        private readonly imageS3HandlerService: ImageS3HandlerService,
        @Inject(ImageWriterServiceToken)
        private readonly imageWriterService: ImageWriterService,
    ) {}

    // 일상공유 게시글 등록 및 이미지 등록
    async createSharePostWithImages(userId: string, inputSharePostDTO: InputSharePostDTO, files: Express.Multer.File[]) {
        const session: ClientSession = await this.connection.startSession();
        session.startTransaction();

        let imageKeys: string[] = [];

        try {
            const sharePost = await this.sharePostRepository.createSharePost(userId, inputSharePostDTO, session);
            if (!sharePost?.id) {
                throw new InternalServerErrorException('Failed to create sharePost');
            }

            imageKeys = await this.imageS3HandlerService.uploadToS3(files);

            await this.imageWriterService.createImage(sharePost.id, imageKeys, ImageType.Share, session);

            await session.commitTransaction();
        } catch (error) {
            await this.imageS3HandlerService.deleteImagesFromS3(imageKeys);
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
    }

    // 일상공유 댓글 등록
    async createShareComment(userId: string, inputShareCommentDTO: InputShareCommentDTO) {
        await this.shareSearcherService.isExistsPostId(inputShareCommentDTO.postId);

        const comment = await this.shareCommentRepository.createComment(userId, inputShareCommentDTO);
        if (!comment?.id) {
            throw new InternalServerErrorException('Failed to create ShareComment');
        }
    }

    // 일상공유 대댓글 등록
    async createShareCommentReply(userId: string, inputShareCommentReplyDTO: InputShareCommentReplyDTO) {
        const session: ClientSession = await this.connection.startSession();
        session.startTransaction();

        try {
            const shareComment = await this.shareSearcherService.isExistsCommentId(inputShareCommentReplyDTO.commentId);

            const reply = await this.shareCommentReplyRepository.createCommentReply(userId, inputShareCommentReplyDTO, session);
            if (!reply?.id) {
                throw new InternalServerErrorException('Failed to create ShareCommentReply');
            }

            if (shareComment?.id) {
                await this.shareUpdaterService.incrementReplyCount(shareComment.id, session);
            }

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
    }

    // 일상공유 게시물 좋아요 등록
    async createShareLike(userId: string, postId: string) {
        await this.shareSearcherService.isExistsPostId(postId);

        const inputShareLikeDTO: InputShareLikeDTO = { userId: userId, postId: postId };

        const like = await this.shareLikeRepository.createLike(inputShareLikeDTO);
        if (!like?.id) {
            throw new InternalServerErrorException('Failed to create ShareLike');
        }
    }
}
