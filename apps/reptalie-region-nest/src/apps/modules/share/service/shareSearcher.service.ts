import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { handleBSONAndCastError } from '../../../utils/error/errorHandler';
import { ImageSearcherService, ImageSearcherServiceToken } from '../../image/service/imageSearcher.service';
import { UserSearcherService, UserSearcherServiceToken } from '../../user/service/userSearcher.service';
import { ShareCommentRepository } from '../repository/shareComment.repository';
import { ShareCommentReplyRepository } from '../repository/shareCommentReply.repository';
import { ShareLikeRepository } from '../repository/shareLike.repository';
import { SharePostRepository } from '../repository/sharePost.repository';

export const ShareSearcherServiceToken = 'ShareSearcherServiceToken';

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

    async isExistsPost(postId: string) {
        try {
            const post = await this.sharePostRepository.findPost(postId);

            if (!post) {
                throw new NotFoundException('Post not found for the specified user and post id.');
            }

            return post;
        } catch (error) {
            handleBSONAndCastError(error, 'SharePostId Invalid ObjectId');
        }
    }

    async isExistsPostWithUserId(postId: string, userId: string) {
        try {
            const post = await this.sharePostRepository.findPostWithUserId(postId, userId);

            if (!post) {
                throw new NotFoundException('Post not found for the specified user and post id.');
            }

            return post;
        } catch (error) {
            handleBSONAndCastError(error, 'SharePostId Invalid ObjectId');
        }
    }
    async isExistsComment(commentId: string) {
        try {
            const comment = await this.shareCommentRepository.findComment(commentId);

            if (!comment) {
                throw new NotFoundException('Comment not found for the specified user and comment id.');
            }

            return comment;
        } catch (error) {
            handleBSONAndCastError(error, 'ShareCommentId Invalid ObjectId');
        }
    }

    async isExistsCommentWithUserId(commentId: string, userId: string) {
        try {
            const comment = await this.shareCommentRepository.findCommentWithUserId(commentId, userId);

            if (!comment) {
                throw new NotFoundException('Comment not found for the specified user and comment id.');
            }

            return comment;
        } catch (error) {
            handleBSONAndCastError(error, 'ShareCommentId Invalid ObjectId');
        }
    }

    async isExistsCommentReplyWithUserId(commentReplyId: string, userId: string) {
        try {
            const commentReply = await this.shareCommentReplyRepository.findCommentReplyWithUserId(commentReplyId, userId);

            if (!commentReply) {
                throw new NotFoundException('CommentReply not found for the specified user and commentReply id.');
            }

            return commentReply;
        } catch (error) {
            handleBSONAndCastError(error, 'ShareCommentReplyId Invalid ObjectId');
        }
    }

    async getLikeInfo(postId: string, userId: string) {
        await this.isExistsPostWithUserId(postId, userId);

        const like = await this.shareLikeRepository.findLikeByIsCanceled(userId, postId);

        if (!like || !like?.id || like?.isCanceled === undefined) {
            throw new NotFoundException('Like status not found for the specified user and post.');
        }

        return { id: like.id, isCanceled: like.isCanceled };
    }

    async findCommentIdsByPostId(postId: string) {
        try {
            const comment = await this.shareCommentRepository.findCommentIdsByPostId(postId);

            if (!comment) {
                throw new NotFoundException('Comment not found for the specified post id.');
            }

            return comment.map((entity) => entity.id as string);
        } catch (error) {
            handleBSONAndCastError(error, 'postId Invalid ObjectId');
        }
    }

    async getUserPostCount(userId: string) {
        return this.sharePostRepository.countDocuments({ userId: userId }).exec();
    }

    async getPostLikeCount(postId: string) {
        return this.shareLikeRepository.countDocuments({ postId: postId, isCanceled: false }).exec();
    }

    async getPostCommentCount(postId: string) {
        return this.shareCommentRepository.countDocuments({ postId: postId, isDeleted: false }).exec();
    }

    async getPostsInfiniteScroll(userId: string, pageParams: number) {
        const followers = userId ? await this.userSearcherService.getUserFollowers(userId) : undefined;

        const posts =
            followers !== undefined
                ? await this.sharePostRepository.findFollowersPosts(followers, pageParams, 10)
                : await this.sharePostRepository.findAllPosts(pageParams, 10);

        const items = await Promise.all(
            posts.posts.map(async (entity) => {
                const profileImage =
                    entity.userId.id && (await this.imageSearcherService.getUserProfileImage(entity.userId.id));
                const postImages = entity.id && (await this.imageSearcherService.getPostImages(entity.id));

                return {
                    user: {
                        id: entity.userId.id,
                        nickname: entity.userId.nickname,
                        profile: profileImage,
                        isFollow: userId ? await this.userSearcherService.isExistsFollow(userId, entity.userId.id) : false,
                    },
                    post: {
                        id: entity.id,
                        contents: entity.contents,
                        images: postImages,
                        isMine: userId ? userId === entity.userId.id : false,
                        isLike: userId && entity.id ? await this.shareLikeRepository.findLikeCheck(userId, entity.id) : false,
                        likeCount: entity.id && (await this.getPostLikeCount(entity.id)),
                        commentCount: entity.id && (await this.getPostCommentCount(entity.id)),
                    },
                };
            }),
        );

        const nextPage = posts.isLastPage ? undefined : posts.pageParams;

        return { items: items, nextPage: nextPage };
    }

    async getUserPostsInfiniteScroll(currentUserId: string, targetUserId: string, pageParams: number) {
        const posts = await this.sharePostRepository.findUserPostsForInfiniteScroll(targetUserId, pageParams, 10);
        const isMine = currentUserId ? currentUserId === targetUserId : false;

        const items = await Promise.all(
            posts.posts.map(async (entity) => {
                const postImages = entity.id && (await this.imageSearcherService.getPostImages(entity.id));

                return {
                    id: entity.id,
                    contents: entity.contents,
                    images: postImages,
                    isMine: isMine,
                    isLike:
                        currentUserId && entity.id
                            ? await this.shareLikeRepository.findLikeCheck(currentUserId, entity.id)
                            : false,
                    likeCount: entity.id && (await this.getPostLikeCount(entity.id)),
                    commentCount: entity.id && (await this.getPostCommentCount(entity.id)),
                };
            }),
        );

        const nextPage = posts.isLastPage ? undefined : posts.pageParams;

        return { items: items, nextPage: nextPage };
    }

    async getCommentsInfiniteScroll(userId: string, postId: string, pageParams: number) {
        const comments = await this.shareCommentRepository.findCommentsForInfiniteScroll(postId, pageParams, 10);

        const items = await Promise.all(
            comments.comments.map(async (entity) => {
                const profile = entity.userId.id && (await this.imageSearcherService.getUserProfileImage(entity.userId.id));

                return {
                    user: {
                        id: entity.userId.id,
                        profile: profile,
                        nickname: entity.userId.nickname,
                    },
                    comment: {
                        id: entity.id,
                        contents: entity.contents,
                        replyCount: entity.replyCount,
                        isMine: userId ? entity.userId.id === userId : false,
                        isModified: entity.createdAt?.getTime() !== entity.updatedAt?.getTime(),
                    },
                };
            }),
        );

        const nextPage = comments.isLastPage ? undefined : comments.pageParams;

        return { items: items, nextPage: nextPage };
    }

    async getCommentRepliesInfiniteScroll(userId: string, commentId: string, pageParams: number) {
        const commentReplies = await this.shareCommentReplyRepository.findCommentRepliesForInfiniteScroll(
            commentId,
            pageParams,
            10,
        );

        const items = await Promise.all(
            commentReplies.commentReplies.map(async (entity) => {
                const profile = entity.userId.id && (await this.imageSearcherService.getUserProfileImage(entity.userId.id));

                return {
                    user: {
                        id: entity.userId.id,
                        profile: profile,
                        nickname: entity.userId.nickname,
                    },
                    comment: {
                        id: entity.id,
                        contents: entity.contents,
                        isMine: userId ? entity.userId.id === userId : false,
                        isModified: entity.createdAt?.getTime() !== entity.updatedAt?.getTime(),
                    },
                };
            }),
        );

        const nextPage = commentReplies.isLastPage ? undefined : commentReplies.pageParams;

        return { items: items, nextPage: nextPage };
    }
}
