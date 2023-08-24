import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { ClientSession } from 'mongoose';
import { ImageType } from '../../../dto/image/input-image.dto';
import { InputShareCommentDTO } from '../../../dto/share/comment/input-shareComment.dto';
import { InputShareCommentReplyDTO } from '../../../dto/share/commentReply/input-shareCommentReply.dto';
import { InputSharePostDTO } from '../../../dto/share/post/input-sharePost.dto';
import { TagType } from '../../../dto/tag/input-tag.dto';
import { ImageS3HandlerServiceToken, ImageS3HandlerService } from '../../image/service/imageS3Handler.service';
import { ImageWriterServiceToken, ImageWriterService } from '../../image/service/imageWriter.service';

import { TagWriterService, TagWriterServiceToken } from '../../tag/service/tagWriter.service';
import { UserSearcherService, UserSearcherServiceToken } from '../../user/service/userSearcher.service';
import { ShareCommentRepository } from '../repository/shareComment.repository';
import { ShareCommentReplyRepository } from '../repository/shareCommentReply.repository';
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

        @Inject(TagWriterServiceToken)
        private readonly tagWriterService: TagWriterService,
        @Inject(ShareUpdaterServiceToken)
        private readonly shareUpdaterService: ShareUpdaterService,
        @Inject(ShareSearcherServiceToken)
        private readonly shareSearcherService: ShareSearcherService,
        @Inject(UserSearcherServiceToken)
        private readonly userSearcherService: UserSearcherService,
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
                throw new BadRequestException('Failed to create share post');
            }

            if (inputSharePostDTO?.tagIds) {
                await this.userSearcherService.isExistsTagsId(inputSharePostDTO.tagIds);
                await this.tagWriterService.createTag(sharePost.id, TagType.Share, inputSharePostDTO.tagIds, session);
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
        const session: ClientSession = await this.connection.startSession();
        session.startTransaction();

        try {
            await this.shareSearcherService.isExistsPostId(inputShareCommentDTO.postId);

            const comment = await this.shareCommentRepository.createComment(userId, inputShareCommentDTO, session);

            if (!comment?.id) {
                throw new BadRequestException('Failed to create comment');
            }

            // tagIds가 존재하는 경우, 해당 데이터의 존재 여부 검사 및 생성
            if (inputShareCommentDTO?.tagIds) {
                await this.userSearcherService.isExistsTagsId(inputShareCommentDTO.tagIds);
                await this.tagWriterService.createTag(comment.id, TagType.Comment, inputShareCommentDTO.tagIds, session);
            }

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
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
                throw new BadRequestException('Failed to create comment-reply');
            }

            // tagIds가 존재하는 경우, 해당 데이터의 존재 여부 검사 및 생성
            if (inputShareCommentReplyDTO?.tagIds) {
                await this.userSearcherService.isExistsTagsId(inputShareCommentReplyDTO.tagIds);
                await this.tagWriterService.createTag(
                    reply.id,
                    TagType.CommentReply,
                    inputShareCommentReplyDTO.tagIds,
                    session,
                );
            }

            if (shareComment.id) {
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
}
