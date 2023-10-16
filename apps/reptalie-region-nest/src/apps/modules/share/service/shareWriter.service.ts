import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { ClientSession } from 'mongoose';
import { ImageType } from '../../../dto/image/input-image.dto';
import { InputShareCommentDTO } from '../../../dto/share/comment/input-shareComment.dto';
import { InputShareCommentReplyDTO } from '../../../dto/share/commentReply/input-shareCommentReply.dto';
import { InputSharePostDTO } from '../../../dto/share/post/input-sharePost.dto';
import { IResponseUserDTO } from '../../../dto/user/response-user.dto';
import { serviceErrorHandler } from '../../../utils/error/errorHandler';
import { ImageS3HandlerServiceToken, ImageS3HandlerService } from '../../image/service/imageS3Handler.service';
import { ImageWriterServiceToken, ImageWriterService } from '../../image/service/imageWriter.service';
import { UserSearcherService, UserSearcherServiceToken } from '../../user/service/userSearcher.service';
import { ShareCommentRepository } from '../repository/shareComment.repository';
import { ShareCommentReplyRepository } from '../repository/shareCommentReply.repository';
import { ShareLikeRepository } from '../repository/shareLike.repository';
import { SharePostRepository } from '../repository/sharePost.repository';
import { ShareSearcherService, ShareSearcherServiceToken } from './shareSearcher.service';

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

        @Inject(ImageS3HandlerServiceToken)
        private readonly imageS3HandlerService: ImageS3HandlerService,
        @Inject(ImageWriterServiceToken)
        private readonly imageWriterService: ImageWriterService,
        @Inject(UserSearcherServiceToken)
        private readonly userSearcherService: UserSearcherService,
        @Inject(ShareSearcherServiceToken)
        private readonly shareSearcherService: ShareSearcherService,
    ) {}

    // 일상공유 게시글 등록 및 이미지 등록
    async createPostWithImages(user: IResponseUserDTO, dto: InputSharePostDTO, files: Express.Multer.File[]) {
        const session: ClientSession = await this.connection.startSession();
        session.startTransaction();

        let imageKeys: string[] = [];

        try {
            // 추후 user관련 구현 후 삭제할 예정
            const userInfo = await this.userSearcherService.getUserInfo({ targetUserId: user.id });

            const post = await this.sharePostRepository.createPost(user.id, dto, session);
            if (!post.id) {
                throw new InternalServerErrorException('Failed to save share post.');
            }

            imageKeys = await this.imageS3HandlerService.uploadToS3(files);

            await this.imageWriterService.createImage(post.id, imageKeys, ImageType.Share, session);

            await session.commitTransaction();

            const postInfo = await this.shareSearcherService.getPostInfo({ create: { post, imageKeys } });
            return { post: { ...postInfo, user: userInfo } };
        } catch (error) {
            await this.imageS3HandlerService.deleteImagesFromS3(imageKeys);
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
    }

    // 일상공유 댓글 등록
    async createComment(user: IResponseUserDTO, dto: InputShareCommentDTO) {
        await this.shareSearcherService.isExistsPost(dto.postId);

        // 추후 user관련 구현 후 삭제할 예정
        const userInfo = await this.userSearcherService.getUserInfo({ targetUserId: user.id });

        const comment = await this.shareCommentRepository.createComment(user.id, dto);
        if (!comment.id) {
            throw new InternalServerErrorException('Failed to save share comment.');
        }

        const commentInfo = await this.shareSearcherService.getCommentInfo({ create: { comment } });

        return { post: { id: comment.postId, comment: { ...commentInfo, user: userInfo } } };
    }

    // 일상공유 대댓글 등록
    async createCommentReply(user: IResponseUserDTO, dto: InputShareCommentReplyDTO) {
        const comment = await this.shareSearcherService.isExistsComment(dto.commentId);

        // 추후 user관련 구현 후 삭제할 예정
        const userInfo = await this.userSearcherService.getUserInfo({ targetUserId: user.id });

        const commentReply = await this.shareCommentReplyRepository.createCommentReply(user.id, dto);
        if (!commentReply.id) {
            throw new InternalServerErrorException('Failed to save share comment reply.');
        }

        const commentReplyInfo = await this.shareSearcherService.getCommentReplyInfo({ create: { commentReply } });
        return {
            post: {
                id: comment?.postId,
                comment: { id: commentReply.commentId, commentReply: { ...commentReplyInfo, user: userInfo } },
            },
        };
    }

    // 일상공유 게시물 좋아요 등록
    async createLike(userId: string, postId: string) {
        try {
            const post = await this.shareSearcherService.isExistsPost(postId);

            const like = await this.shareLikeRepository.createLike({ userId, postId });
            if (!like) {
                throw new InternalServerErrorException('Failed to save share like.');
            }

            return { post: { id: like.postId, user: { nickname: post?.userId.nickname } } };
        } catch (error) {
            serviceErrorHandler(error, 'post and user Id should be unique values.');
        }
    }
}
