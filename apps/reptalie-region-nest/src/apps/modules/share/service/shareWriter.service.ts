import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { ClientSession } from 'mongoose';
import { ImageType } from '../../../dto/image/input-image.dto';
import { InputShareCommentDTO } from '../../../dto/share/comment/input-shareComment.dto';
import { InputShareCommentReplyDTO } from '../../../dto/share/commentReply/input-shareCommentReply.dto';
import { InputSharePostDTO } from '../../../dto/share/post/input-sharePost.dto';
import { IResponseUserDTO } from '../../../dto/user/user/response-user.dto';
import { serviceErrorHandler } from '../../../utils/error/errorHandler';
import { ImageS3HandlerServiceToken, ImageS3HandlerService } from '../../image/service/imageS3Handler.service';
import { ImageWriterServiceToken, ImageWriterService } from '../../image/service/imageWriter.service';
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
        @Inject(ShareSearcherServiceToken)
        private readonly shareSearcherService: ShareSearcherService,
    ) {}

    /**
     * 이미지를 포함한 새로운 게시물을 생성합니다.
     *
     * @param user - 게시물을 생성하는 사용자입니다.
     * @param dto - 게시물의 세부 정보를 담고 있는 데이터 전송 객체입니다.
     * @param files - 게시물과 연결될 이미지 파일들의 배열입니다.
     * @returns 생성된 게시물과 사용자 정보를 반환합니다.
     */
    async createPostWithImages(user: IResponseUserDTO, dto: InputSharePostDTO, files: Express.Multer.File[]) {
        const session: ClientSession = await this.connection.startSession();
        session.startTransaction();

        let imageKeys: string[] = [];

        try {
            const post = await this.sharePostRepository.createPost(user.id, dto, session);
            if (!post.id) {
                throw new InternalServerErrorException('Failed to save share post.');
            }

            imageKeys = await this.imageS3HandlerService.uploadToS3(files);

            await this.imageWriterService.createImage(post.id, imageKeys, ImageType.Share, session);

            await session.commitTransaction();

            const postInfo = await this.shareSearcherService.getPostInfo({ create: { post, imageKeys } });
            return { post: { ...postInfo, user } };
        } catch (error) {
            await this.imageS3HandlerService.deleteImagesFromS3(imageKeys);
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
    }

    /**
     * 새 댓글을 생성합니다.
     *
     * @param user - 댓글을 생성하는 사용자입니다.
     * @param dto - 댓글의 세부 정보를 담고 있는 데이터 전송 객체입니다.
     * @returns 생성된 댓글과 사용자 정보를 반환합니다.
     */
    async createComment(user: IResponseUserDTO, dto: InputShareCommentDTO) {
        await this.shareSearcherService.findPost(dto.postId);

        const comment = await this.shareCommentRepository.createComment(user.id, dto);
        if (!comment.id) {
            throw new InternalServerErrorException('Failed to save share comment.');
        }

        const commentInfo = await this.shareSearcherService.getCommentInfo({ create: { comment } });

        return { post: { id: comment.postId, comment: { ...commentInfo, user } } };
    }

    /**
     * 댓글에 대한 답글을 생성합니다.
     *
     * @param user - 댓글에 대한 답글을 생성하는 사용자입니다.
     * @param dto - 댓글에 대한 답글의 세부 정보를 담고 있는 데이터 전송 객체입니다.
     * @returns 생성된 댓글에 대한 답글과 사용자 정보를 반환합니다.
     */
    async createCommentReply(user: IResponseUserDTO, dto: InputShareCommentReplyDTO) {
        const comment = await this.shareSearcherService.findComment(dto.commentId);

        const commentReply = await this.shareCommentReplyRepository.createCommentReply(user.id, dto);
        if (!commentReply.id) {
            throw new InternalServerErrorException('Failed to save share comment reply.');
        }

        const commentReplyInfo = await this.shareSearcherService.getCommentReplyInfo({ create: { commentReply } });
        return {
            post: {
                id: comment?.postId,
                comment: { id: commentReply.commentId, commentReply: { ...commentReplyInfo, user } },
            },
        };
    }

    /**
     * 게시물에 좋아요를 생성합니다.
     *
     * @param userId - 좋아요를 생성하는 사용자의 ID입니다.
     * @param postId - 좋아요를 생성할 게시물의 ID입니다.
     * @returns 생성된 좋아요 정보를 반환합니다.
     */
    async createLike(userId: string, postId: string) {
        try {
            const post = await this.shareSearcherService.findPost(postId);

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
