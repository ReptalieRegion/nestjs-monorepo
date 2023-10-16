import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { IResponseShareCommentDTO } from '../../../dto/share/comment/response-shareCommnet.dto';
import { IResponseShareCommentReplyDTO } from '../../../dto/share/commentReply/response-shareCommentReply.dto';
import { IResponseSharePostDTO } from '../../../dto/share/post/response-sharePost.dto';
import { serviceErrorHandler } from '../../../utils/error/errorHandler';
import { ImageSearcherService, ImageSearcherServiceToken } from '../../image/service/imageSearcher.service';
import { UserSearcherService, UserSearcherServiceToken } from '../../user/service/userSearcher.service';
import { ShareCommentRepository } from '../repository/shareComment.repository';
import { ShareCommentReplyRepository } from '../repository/shareCommentReply.repository';
import { ShareLikeRepository } from '../repository/shareLike.repository';
import { SharePostRepository } from '../repository/sharePost.repository';

export const ShareSearcherServiceToken = 'ShareSearcherServiceToken';

interface PostOption {
    create?: { post: Partial<IResponseSharePostDTO>; imageKeys: string[] };
    update?: { postId: string };
    delete?: { postId: string };
}

interface CommentOption {
    create?: { comment: Partial<IResponseShareCommentDTO> };
    update?: { commentId: string };
    delete?: { commentId: string };
}

interface CommentReplyOption {
    create?: { commentReply: Partial<IResponseShareCommentReplyDTO> };
    update?: { commentReplyId: string };
    delete?: { commentReplyId: string };
}

@Injectable()
export class ShareSearcherService {
    constructor(
        private readonly sharePostRepository: SharePostRepository,
        private readonly shareCommentRepository: ShareCommentRepository,
        private readonly shareCommentReplyRepository: ShareCommentReplyRepository,
        private readonly shareLikeRepository: ShareLikeRepository,

        @Inject(ImageSearcherServiceToken)
        private readonly imageSearcherService: ImageSearcherService,
        @Inject(forwardRef(() => UserSearcherServiceToken))
        private readonly userSearcherService: UserSearcherService,
    ) {}

    /**
     *
     *  추후 게시글 조회 로직 수정해야함
     */
    async getPostsInfiniteScroll(currentUserId: string, pageParam: number, limitSize: number) {
        const posts = await this.sharePostRepository
            .find({ isDeleted: false })
            .sort({ updatedAt: -1, createdAt: -1 })
            .skip(pageParam * limitSize)
            .limit(limitSize)
            .exec();

        const items = await Promise.all(
            posts.map(async (entity) => {
                const post = Object(entity).Mapper();
                const userInfo = await this.userSearcherService.getUserInfo({ targetUserId: post.userId, currentUserId });
                const images = post.id && (await this.imageSearcherService.getPostImages(post.id));

                return {
                    post: {
                        id: post.id,
                        contents: post.contents,
                        images,
                        isMine: currentUserId ? currentUserId === userInfo.id : false,
                        isLike: currentUserId && post.id ? await this.isExistsLike(currentUserId, post.id) : undefined,
                        likeCount: post.id && (await this.getLikeCount(post.id)),
                        commentCount: post.id && (await this.getCommentCount(post.id)),
                        user: { ...userInfo },
                    },
                };
            }),
        );

        const isLastPage = posts.length < limitSize;
        const nextPage = isLastPage ? undefined : pageParam + 1;

        return { items, nextPage };
    }

    async getUserPostsInfiniteScroll(currentUserId: string, targetNickname: string, pageParam: number, limitSize: number) {
        const targetUserId = (await this.userSearcherService.isExistsNickname(targetNickname)).id;

        const posts = await this.sharePostRepository
            .find({ userId: targetUserId, isDeleted: false })
            .sort({ updatedAt: -1, createdAt: -1 })
            .skip(pageParam * limitSize)
            .limit(limitSize)
            .exec();

        const isMine = currentUserId ? currentUserId === targetUserId : false;
        const items = await Promise.all(
            posts.map(async (entity) => {
                const post = entity.Mapper();
                const images = post.id && (await this.imageSearcherService.getPostImages(post.id));

                return {
                    post: {
                        id: post.id,
                        contents: post.contents,
                        images,
                        isMine,
                        isLike: currentUserId && post.id ? await this.isExistsLike(currentUserId, post?.id) : undefined,
                        likeCount: post.id && (await this.getLikeCount(post.id)),
                        commentCount: post.id && (await this.getCommentCount(post.id)),
                    },
                };
            }),
        );

        const isLastPage = posts.length < limitSize;
        const nextPage = isLastPage ? undefined : pageParam + 1;

        return { items, nextPage };
    }

    async getCommentsInfiniteScroll(userId: string, postId: string, pageParam: number, limitSize: number) {
        const comments = await this.shareCommentRepository
            .find({ postId, isDeleted: false })
            .populate({
                path: 'userId',
                select: 'nickname imageId',
                populate: { path: 'imageId', model: 'Image', select: 'imageKey -_id' },
            })
            .sort({ updatedAt: -1, createdAt: -1 })
            .skip(pageParam * limitSize)
            .limit(limitSize)
            .exec();

        const items = await Promise.all(
            comments.map(async (entity) => {
                const comment = entity.Mapper();
                const userInfo = await this.userSearcherService.getUserInfo({ user: entity.userId });

                return {
                    comment: {
                        id: comment.id,
                        contents: comment.contents,
                        replyCount: comment.id && (await this.getCommentReplyCount(comment.id)),
                        isMine: userId ? userInfo.id === userId : false,
                        isModified: comment.createdAt?.getTime() !== comment.updatedAt?.getTime(),
                        user: { ...userInfo },
                    },
                };
            }),
        );

        const isLastPage = comments.length < limitSize;
        const nextPage = isLastPage ? undefined : pageParam + 1;

        return { items, nextPage };
    }

    async getCommentRepliesInfiniteScroll(userId: string, commentId: string, pageParam: number, limitSize: number) {
        const commentReplies = await this.shareCommentReplyRepository
            .find({ commentId, isDeleted: false })
            .populate({
                path: 'userId',
                select: 'nickname imageId',
                populate: { path: 'imageId', model: 'Image', select: 'imageKey -_id' },
            })
            .sort({ updatedAt: -1, createdAt: -1 })
            .skip(pageParam * limitSize)
            .limit(limitSize)
            .exec();

        const items = await Promise.all(
            commentReplies.map(async (entity) => {
                const cmmentReply = entity.Mapper();
                const userInfo = await this.userSearcherService.getUserInfo({ user: entity.userId });

                return {
                    commentReply: {
                        id: cmmentReply.id,
                        contents: cmmentReply.contents,
                        isMine: userId ? userInfo.id === userId : false,
                        isModified: cmmentReply.createdAt?.getTime() !== cmmentReply.updatedAt?.getTime(),
                        user: { ...userInfo },
                    },
                };
            }),
        );

        const isLastPage = commentReplies.length < limitSize;
        const nextPage = isLastPage ? undefined : pageParam + 1;

        return { items, nextPage };
    }

    async getLikeListForPostInfiniteScroll(userId: string, postId: string, pageParam: number, limitSize: number) {
        try {
            const likes = await this.shareLikeRepository
                .find({ postId, isCanceled: false }, { userId: 1 })
                .populate({
                    path: 'userId',
                    select: 'nickname imageId',
                    populate: { path: 'imageId', model: 'Image', select: 'imageKey -_id' },
                })
                .skip(pageParam * limitSize)
                .limit(limitSize)
                .exec();

            const currentUserId = userId ? userId : undefined;

            const items = await Promise.all(
                likes.map(async (entity) => {
                    const userInfo = await this.userSearcherService.getUserInfo({ user: entity.userId, currentUserId });

                    return { user: { ...userInfo } };
                }),
            );

            const isLastPage = likes.length < limitSize;
            const nextPage = isLastPage ? undefined : pageParam + 1;

            return { items, nextPage };
        } catch (error) {
            serviceErrorHandler(error, 'Invalid ObjectId for user Id');
        }
    }

    /**
     *    여러 곳에서 공유되는 함수들 모음
     *
     *
     */

    async getPostInfo(option: PostOption) {
        if (option.create) {
            const { id, contents } = option.create.post;
            const images = option.create.imageKeys.map((value) => ({ src: `${process.env.AWS_IMAGE_BASEURL}${value}` }));

            return { id, contents, images, isMine: true, isLike: undefined, likeCount: 0, commentCount: 0 };
        } else if (option.update) {
            const id = option.update.postId;
            const post = await this.sharePostRepository.findOne({ _id: id, isDeleted: false }).exec();
            const mappedPost = post?.Mapper();
            const [images, isLike, likeCount, commentCount] = await Promise.all([
                mappedPost?.id && this.imageSearcherService.getPostImages(mappedPost.id),
                mappedPost?.userId && mappedPost?.id ? this.isExistsLike(mappedPost.userId, mappedPost.id) : undefined,
                mappedPost?.id && this.getLikeCount(mappedPost.id),
                mappedPost?.id && this.getCommentCount(mappedPost.id),
            ]);

            return { id, contents: mappedPost?.contents, images, isMine: true, isLike, likeCount, commentCount };
        } else if (option.delete) {
            const _id = option.delete.postId;
            const post = await this.sharePostRepository
                .findOne({ _id })
                .populate({ path: 'userId', select: 'nickname' })
                .exec();
            const mappedPost = { ...post?.Mapper(), userId: post?.userId };

            return { post: { id: mappedPost?.id, user: { nickname: mappedPost?.userId?.nickname } } };
        }
    }

    async getCommentInfo(option: CommentOption) {
        if (option.create) {
            const { id, contents } = option.create.comment;

            return { id, contents, replyCount: 0, isMine: true, isModified: false };
        } else if (option.update) {
            const _id = option.update.commentId;
            const comment = await this.shareCommentRepository.findOne({ _id, isDeleted: false }).exec();
            const mappedComment = comment?.Mapper();

            return { id: mappedComment?.postId, comment: { id: mappedComment?.id, contents: mappedComment?.contents } };
        } else if (option.delete) {
            const _id = option.delete.commentId;
            const comment = await this.shareCommentRepository
                .findOne({ _id })
                .populate({ path: 'postId', populate: { path: 'userId', select: 'nickname -_id' } })
                .exec();

            const mappedComment = { ...comment?.Mapper(), postId: { ...Object(comment?.postId).Mapper() } };

            return {
                post: {
                    id: mappedComment.postId.id,
                    comment: { id: mappedComment.id },
                    user: { nickname: mappedComment.postId.userId.nickname },
                },
            };
        }
    }

    async getCommentReplyInfo(option: CommentReplyOption) {
        if (option.create) {
            const { id, contents } = option.create.commentReply;

            return { id, contents, isMine: true, isModified: false };
        } else if (option.update) {
            const _id = option.update.commentReplyId;
            const commentReply = await this.shareCommentReplyRepository.findOne({ _id, isDeleted: false }).exec();
            const mappedCommentReply = commentReply?.Mapper();

            return {
                id: mappedCommentReply?.commentId,
                commentReply: { id: mappedCommentReply?.id, contents: mappedCommentReply?.contents },
            };
        } else if (option.delete) {
            const _id = option.delete.commentReplyId;
            const commentReply = await this.shareCommentReplyRepository
                .findOne({ _id })
                .populate({ path: 'commentId', select: 'postId' })
                .exec();

            const mappedCommentReply = { ...commentReply?.Mapper(), commentId: Object(commentReply?.commentId).Mapper() };

            return {
                post: {
                    id: mappedCommentReply.commentId.postId,
                    comment: { id: mappedCommentReply.commentId.id, commentReply: { id: mappedCommentReply?.id } },
                },
            };
        }
    }

    async getLikeStatus(postId: string, userId: string) {
        try {
            const like = await this.shareLikeRepository
                .findOne({ userId, postId })
                .populate({ path: 'postId', select: 'userId', populate: { path: 'userId', select: 'nickname -_id' } })
                .exec();

            if (!like) {
                throw new NotFoundException('Not found for the specified share like status.');
            }

            return { ...like.Mapper(), postId: Object(like.postId).Mapper() };
        } catch (error) {
            serviceErrorHandler(error, 'Invalid ObjectId for share post Id.');
        }
    }

    async isExistsPost(postId: string) {
        try {
            const post = await this.sharePostRepository
                .findOne({ _id: postId, isDeleted: false })
                .populate({ path: 'userId', select: 'nickname -_id' })
                .exec();

            if (!post) {
                throw new NotFoundException('Not found for the specified share Post Id.');
            }

            return { ...post.Mapper(), userId: Object(post.userId).Mapper() };
        } catch (error) {
            serviceErrorHandler(error, 'Invalid ObjectId for share post Id.');
        }
    }

    async isExistsComment(commentId: string) {
        try {
            const comment = await this.shareCommentRepository.findOne({ _id: commentId, isDeleted: false }).exec();

            if (!comment) {
                throw new NotFoundException('Not found for the specified share comment Id.');
            }

            return comment.Mapper();
        } catch (error) {
            serviceErrorHandler(error, 'Invalid ObjectId for share comment Id .');
        }
    }

    async isExistsLike(userId: string, postId: string): Promise<boolean | undefined> {
        const like = await this.shareLikeRepository.findOne({ userId, postId }).exec();
        return like ? (like.isCanceled ? false : true) : undefined;
    }

    async getPostCount(userId: string): Promise<number> {
        return this.sharePostRepository.countDocuments({ userId, isDeleted: false }).exec();
    }

    async getLikeCount(postId: string): Promise<number> {
        return this.shareLikeRepository.countDocuments({ postId, isCanceled: false }).exec();
    }

    async getCommentCount(postId: string): Promise<number> {
        return this.shareCommentRepository.countDocuments({ postId, isDeleted: false }).exec();
    }

    async getCommentReplyCount(commentId: string): Promise<number> {
        return this.shareCommentReplyRepository.countDocuments({ commentId, isDeleted: false }).exec();
    }

    async getCommentIds(postId: string): Promise<string[]> {
        const comments = await this.shareCommentRepository.find({ postId, isDeleted: false }, { _id: 1 }).exec();
        return comments.map((entity) => entity.Mapper().id as string);
    }
}
