import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { IResponseShareCommentDTO } from '../../../dto/share/comment/response-shareCommnet.dto';
import { IResponseShareCommentReplyDTO } from '../../../dto/share/commentReply/response-shareCommentReply.dto';
import { IResponseSharePostDTO } from '../../../dto/share/post/response-sharePost.dto';
import { handleBSONAndCastError } from '../../../utils/error/errorHandler';
import { ImageSearcherService, ImageSearcherServiceToken } from '../../image/service/imageSearcher.service';
import { UserSearcherService, UserSearcherServiceToken } from '../../user/service/userSearcher.service';
import { ShareCommentRepository } from '../repository/shareComment.repository';
import { ShareCommentReplyRepository } from '../repository/shareCommentReply.repository';
import { ShareLikeRepository } from '../repository/shareLike.repository';
import { SharePostRepository } from '../repository/sharePost.repository';

export const ShareSearcherServiceToken = 'ShareSearcherServiceToken';

interface OperationOption {
    create?: {
        post?: {
            sharePost: Partial<IResponseSharePostDTO>;
            imageKeys: string[];
        };
        comment?: Partial<IResponseShareCommentDTO>;
        commentReply?: Partial<IResponseShareCommentReplyDTO>;
    };
    update?: {
        postId?: string;
        commentId?: string;
        commentReplyId?: string;
    };
    delete?: {
        postId?: string;
        commentId?: string;
        commentReplyId?: string;
    };
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

    async getPostsInfiniteScroll(userId: string, pageParams: number, limitSize: number) {
        const followers = userId ? await this.userSearcherService.getUserFollowers(userId) : undefined;

        const posts = await this.sharePostRepository
            .find({ $or: [{ userId: { $in: followers } }, { userId: { $nin: followers } }], isDeleted: false })
            .populate({
                path: 'userId',
                select: 'nickname imageId',
                populate: { path: 'imageId', model: 'Image', select: 'imageKey -_id' },
            })
            .sort({ updatedAt: -1, createdAt: -1 })
            .skip(pageParams * limitSize)
            .limit(limitSize)
            .exec();

        const items = await Promise.all(
            posts.map(async (entity) => {
                const post = entity.Mapper();
                const userInfo = await this.userSearcherService.getUserInfo({ user: { user: entity.userId } });
                const images = post.id && (await this.imageSearcherService.getPostImages(post.id));

                return {
                    user: {
                        ...userInfo,
                        isFollow: userId ? await this.userSearcherService.isExistsFollow(userId, userInfo.id) : undefined,
                    },
                    post: {
                        id: post.id,
                        contents: post.contents,
                        images,
                        isMine: userId ? userId === userInfo.id : false,
                        isLike: userId && post.id ? await this.isExistsLike(userId, post.id) : undefined,
                        likeCount: post.id && (await this.getLikeCount(post.id)),
                        commentCount: post.id && (await this.getCommentCount(post.id)),
                    },
                };
            }),
        );

        const isLastPage = posts.length < limitSize;
        const nextPage = isLastPage ? undefined : pageParams + 1;

        return { items, nextPage };
    }

    async getUserPostsInfiniteScroll(currentUserId: string, targetNickname: string, pageParams: number, limitSize: number) {
        const targetUserId = (await this.userSearcherService.isExistsNickname(targetNickname)).id;

        const posts = await this.sharePostRepository
            .find({ userId: targetUserId, isDeleted: false })
            .sort({ createdAt: -1 })
            .skip(pageParams * limitSize)
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
        const nextPage = isLastPage ? undefined : pageParams + 1;

        return { items, nextPage };
    }

    async getCommentsInfiniteScroll(userId: string, postId: string, pageParams: number, limitSize: number) {
        const comments = await this.shareCommentRepository
            .find({ postId, isDeleted: false })
            .populate({
                path: 'userId',
                select: 'nickname imageId',
                populate: { path: 'imageId', model: 'Image', select: 'imageKey -_id' },
            })
            .sort({ createdAt: -1 })
            .skip(pageParams * limitSize)
            .limit(limitSize)
            .exec();

        const items = await Promise.all(
            comments.map(async (entity) => {
                const comment = entity.Mapper();
                const userInfo = await this.userSearcherService.getUserInfo({ user: { user: entity.userId } });

                return {
                    user: { ...userInfo },
                    comment: {
                        id: comment.id,
                        contents: comment.contents,
                        replyCount: comment.id && (await this.getCommentReplyCount(comment.id)),
                        isMine: userId ? userInfo.id === userId : false,
                        isModified: comment.createdAt?.getTime() !== comment.updatedAt?.getTime(),
                    },
                };
            }),
        );

        const isLastPage = comments.length < limitSize;
        const nextPage = isLastPage ? undefined : pageParams + 1;

        return { items, nextPage };
    }

    async getCommentRepliesInfiniteScroll(userId: string, commentId: string, pageParams: number, limitSize: number) {
        const commentReplies = await this.shareCommentReplyRepository
            .find({ commentId, isDeleted: false })
            .populate({
                path: 'userId',
                select: 'nickname imageId',
                populate: { path: 'imageId', model: 'Image', select: 'imageKey -_id' },
            })
            .sort({ createdAt: -1 })
            .skip(pageParams * limitSize)
            .limit(limitSize)
            .exec();

        const items = await Promise.all(
            commentReplies.map(async (entity) => {
                const cmmentReply = entity.Mapper();
                const userInfo = await this.userSearcherService.getUserInfo({ user: { user: entity.userId } });

                return {
                    user: { ...userInfo },
                    comment: {
                        id: cmmentReply.id,
                        contents: cmmentReply.contents,
                        isMine: userId ? userInfo.id === userId : false,
                        isModified: cmmentReply.createdAt?.getTime() !== cmmentReply.updatedAt?.getTime(),
                    },
                };
            }),
        );

        const isLastPage = commentReplies.length < limitSize;
        const nextPage = isLastPage ? undefined : pageParams + 1;

        return { items, nextPage };
    }

    /**
     *    여러 곳에서 공유되는 함수들 모음
     *
     *
     */

    async getPostInfo(option: OperationOption) {
        if (option.create?.post) {
            const id = option.create.post.sharePost.id;
            const contents = option.create.post.sharePost.contents;
            const images = option.create.post.imageKeys.map((value) => ({ src: `${process.env.AWS_IMAGE_BASEURL}${value}` }));

            return { id, contents, images, isMine: true, isLike: undefined, likeCount: 0, commentCount: 0 };
        } else if (option.update?.postId) {
            const _id = option.update.postId;
            const postInfo = (await this.sharePostRepository.findOne({ _id, isDeleted: false }).exec())?.Mapper();
            const images = postInfo?.id && (await this.imageSearcherService.getPostImages(postInfo?.id));
            const isLike = postInfo?.userId && postInfo?.id ? await this.isExistsLike(postInfo.userId, postInfo.id) : undefined;
            const likeCount = postInfo?.id && (await this.getLikeCount(postInfo.id));
            const commentCount = postInfo?.id && (await this.getCommentCount(postInfo.id));

            return { id: _id, contents: postInfo?.contents, images, isMine: true, isLike, likeCount, commentCount };
        } else if (option.delete?.postId) {
            const _id = option.delete.postId;
            const postInfo = (await this.sharePostRepository.findOne({ _id }).exec())?.Mapper();

            return { post: { id: postInfo?.id }, user: { id: postInfo?.userId } };
        }
    }

    async getCommentInfo(option: OperationOption) {
        if (option.create?.comment) {
            const id = option.create.comment.id;
            const contents = option.create.comment.contents;

            return { id, contents, replyCount: 0, isMine: true, isModified: false };
        } else if (option.update?.commentId) {
            const _id = option.update.commentId;
            const commentInfo = (await this.shareCommentRepository.findOne({ _id, isDeleted: false }).exec())?.Mapper();

            return { post: { id: commentInfo?.postId }, comment: { id: commentInfo?.id, contensts: commentInfo?.contents } };
        } else if (option.delete?.commentId) {
            const _id = option.delete.commentId;
            const commentInfo = (await this.shareCommentRepository.findOne({ _id }).exec())?.Mapper();

            return { post: { id: commentInfo?.postId }, comment: { id: commentInfo?.id } };
        }
    }

    async getCommentReplyInfo(option: OperationOption) {
        if (option.create?.commentReply) {
            const id = option.create.commentReply.id;
            const contents = option.create.commentReply.contents;

            return { id, contents, isMine: true, isModified: false };
        } else if (option.update?.commentReplyId) {
            const _id = option.update.commentReplyId;
            const replyInfo = (await this.shareCommentReplyRepository.findOne({ _id, isDeleted: false }).exec())?.Mapper();

            return {
                comment: { id: replyInfo?.commentId },
                commentReply: { id: replyInfo?.id, contents: replyInfo?.contents },
            };
        } else if (option.delete?.commentReplyId) {
            const _id = option.delete.commentReplyId;
            const replyInfo = (
                await this.shareCommentReplyRepository.findOne({ _id }).populate({ path: 'commentId', select: 'postId' }).exec()
            )?.Mapper();
            const comment = Object(replyInfo?.commentId);

            return {
                post: { id: comment.postId.toHexString() },
                comment: { id: comment.id },
                commentReply: { id: replyInfo?.id },
            };
        }
    }

    async getLikeInfo(postId: string, userId: string) {
        try {
            const like = await this.shareLikeRepository.findOne({ userId, postId }, { postId: 1, isCanceled: 1 }).exec();

            if (!like) {
                throw new NotFoundException('Like status not found for the specified user and post.');
            }

            return like.Mapper();
        } catch (error) {
            handleBSONAndCastError(error, 'share post Id Invalid ObjectId');
        }
    }

    async isExistsPost(postId: string) {
        try {
            const post = await this.sharePostRepository.findOne({ _id: postId, isDeleted: false }, { _id: 1 }).exec();

            if (!post) {
                throw new NotFoundException('Post not found for the specified user and post id.');
            }

            return post.Mapper();
        } catch (error) {
            handleBSONAndCastError(error, 'share post Id Invalid ObjectId');
        }
    }

    async isExistsComment(commentId: string) {
        try {
            const comment = await this.shareCommentRepository
                .findOne({ _id: commentId, isDeleted: false }, { _id: 1, postId: 1, replyCount: 1 })
                .exec();

            if (!comment) {
                throw new NotFoundException('Comment not found for the specified user and comment id.');
            }

            return comment.Mapper();
        } catch (error) {
            handleBSONAndCastError(error, 'share comment Id Invalid ObjectId');
        }
    }

    async isExistsCommentReply(commentReplyId: string) {
        try {
            const commentReply = await this.shareCommentReplyRepository
                .findOne({ _id: commentReplyId, isDeleted: false }, { _id: 1, commentId: 1 })
                .exec();

            if (!commentReply) {
                throw new NotFoundException('Comment reply not found for the specified user and comment reply id.');
            }

            return commentReply.Mapper();
        } catch (error) {
            handleBSONAndCastError(error, 'share comment reply Id Invalid ObjectId');
        }
    }

    async isExistsLike(userId: string, postId: string) {
        const like = await this.shareLikeRepository.findOne({ userId, postId }, { isCanceled: 1 }).exec();
        return like ? (like.isCanceled ? false : true) : undefined;
    }

    async getPostCount(userId: string) {
        return this.sharePostRepository.countDocuments({ userId, isDeleted: false }).exec();
    }

    async getLikeCount(postId: string) {
        return this.shareLikeRepository.countDocuments({ postId, isCanceled: false }).exec();
    }

    async getCommentCount(postId: string) {
        return this.shareCommentRepository.countDocuments({ postId, isDeleted: false }).exec();
    }

    async getCommentReplyCount(commentId: string) {
        return this.shareCommentReplyRepository.countDocuments({ commentId, isDeleted: false }).exec();
    }

    async getComments(postId: string) {
        const comments = await this.shareCommentRepository.find({ postId, isDeleted: false }, { _id: 1 }).exec();
        return comments.map((entity) => entity.Mapper().id as string);
    }
}
