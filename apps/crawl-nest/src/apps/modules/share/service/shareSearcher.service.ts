import { HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { IShareComment, IShareCommentReply, ISharePost, SchemaId } from '@private-crawl/types';
import { ReportShareContentType } from '../../../dto/report/share/input-reportShareContent.dto';
import { CustomException } from '../../../utils/error/customException';
import { CustomExceptionHandler } from '../../../utils/error/customException.handler';
import { ImageSearcherService, ImageSearcherServiceToken } from '../../image/service/imageSearcher.service';
import { ReportSearcherService, ReportSearcherServiceToken } from '../../report/service/reportSearcher.service';
import { UserSearcherService, UserSearcherServiceToken } from '../../user/service/userSearcher.service';
import { ShareCommentRepository } from '../repository/shareComment.repository';
import { ShareCommentReplyRepository } from '../repository/shareCommentReply.repository';
import { ShareLikeRepository } from '../repository/shareLike.repository';
import { SharePostRepository } from '../repository/sharePost.repository';

export const ShareSearcherServiceToken = 'ShareSearcherServiceToken';

interface PostOption {
    create?: { post: Partial<ISharePost>; imageKeys: string[] };
    update?: { postId: string };
    delete?: { postId: string };
}

interface CommentOption {
    create?: { comment: Partial<IShareComment> };
    update?: { commentId: string };
    delete?: { commentId: string };
}

interface CommentReplyOption {
    create?: { commentReply: Partial<IShareCommentReply> };
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
        @Inject(ReportSearcherServiceToken)
        private readonly reportSearcherService: ReportSearcherService,
    ) {}

    /**
     *
     *  추후 게시글 조회 로직 수정해야함
     */
    async getPostsInfiniteScroll(currentUserId: string, pageParam: number, limitSize: number) {
        const typeIds = await this.reportSearcherService.findTypeIdList(currentUserId, ReportShareContentType.POST);
        const blockedIds = await this.reportSearcherService.getUserBlockedIds(currentUserId);

        const posts = await this.sharePostRepository
            .find({ _id: { $nin: typeIds }, userId: { $nin: blockedIds }, isDeleted: false })
            .populate({
                path: 'userId',
                select: 'nickname imageId',
                populate: { path: 'imageId', model: 'Image', select: 'imageKey -_id' },
            })
            .sort({ createdAt: -1 })
            .skip(pageParam * limitSize)
            .limit(limitSize)
            .exec();

        const items = await Promise.all(
            posts.map(async (entity) => {
                const post = entity.Mapper();
                const userInfo = await this.userSearcherService.getUserInfo({ user: entity.userId, currentUserId });
                const images = post.id && (await this.imageSearcherService.getPostImages(post.id));

                return {
                    post: {
                        id: post.id,
                        contents: post.contents,
                        createdAt: post.createdAt,
                        images,
                        isMine: currentUserId ? currentUserId === userInfo.id : false,
                        isLike: currentUserId && post.id ? await this.isExistsLike(currentUserId, post.id) : undefined,
                        likeCount: post.id && (await this.getLikeCount(currentUserId, post.id)),
                        commentCount: post.id && (await this.getCommentCount(post.id, currentUserId)),
                        user: { ...userInfo },
                    },
                };
            }),
        );

        const isLastPage = posts.length < limitSize;
        const nextPage = isLastPage ? undefined : pageParam + 1;

        return { items, nextPage };
    }

    /**
     *
     * 특정 게시글 조회 로직
     */
    async getPost(currentUserId: string, postId: string) {
        const typeIds = await this.reportSearcherService.findTypeIdList(currentUserId, ReportShareContentType.POST);
        const blockedIds = await this.reportSearcherService.getUserBlockedIds(currentUserId);

        const entity = await this.sharePostRepository
            .findOne({ _id: { $eq: postId, $nin: typeIds }, userId: { $nin: blockedIds }, isDeleted: false })
            .populate({
                path: 'userId',
                select: 'nickname imageId',
                populate: { path: 'imageId', model: 'Image', select: 'imageKey -_id' },
            })
            .exec();

        if (!entity) {
            throw new CustomException('Not found for the specified share Post Id.', HttpStatus.NOT_FOUND, -2301);
        }

        const post = entity.Mapper();
        const userInfo = await this.userSearcherService.getUserInfo({ user: Object(post.userId), currentUserId });
        const images = post.id && (await this.imageSearcherService.getPostImages(post.id));

        return {
            post: {
                id: post.id,
                contents: post.contents,
                createdAt: post.createdAt,
                images,
                isMine: currentUserId ? currentUserId === userInfo.id : false,
                isLike: currentUserId && post.id ? await this.isExistsLike(currentUserId, post.id) : undefined,
                likeCount: post.id && (await this.getLikeCount(currentUserId, post.id)),
                commentCount: post.id && (await this.getCommentCount(post.id, currentUserId)),
                user: { ...userInfo },
            },
        };
    }

    /**
     * 무한 스크롤로 사용자 게시물을 가져옵니다.
     *
     * @param currentUserId - 현재 사용자의 ID입니다.
     * @param targetNickname - 게시물을 가져올 대상 사용자의 별명입니다.
     * @param pageParam - 현재 페이지 번호입니다.
     * @param limitSize - 한 페이지당 가져올 게시물 수입니다.
     * @returns 가져온 게시물과 다음 페이지 번호를 반환합니다.
     */
    async getUserPostsInfiniteScroll(currentUserId: string, targetNickname: string, pageParam: number, limitSize: number) {
        const typeIds = await this.reportSearcherService.findTypeIdList(currentUserId, ReportShareContentType.POST);
        const targetUserId = (await this.userSearcherService.findNickname(targetNickname))?.id;

        const posts = await this.sharePostRepository
            .find({ userId: targetUserId, isDeleted: false, _id: { $nin: typeIds } })
            .sort({ createdAt: -1 })
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
                        createdAt: post.createdAt,
                        images,
                        isMine,
                        isLike: currentUserId && post.id ? await this.isExistsLike(currentUserId, post?.id) : undefined,
                        likeCount: post.id && (await this.getLikeCount(currentUserId, post.id)),
                        commentCount: post.id && (await this.getCommentCount(post.id, currentUserId)),
                    },
                };
            }),
        );

        const isLastPage = posts.length < limitSize;
        const nextPage = isLastPage ? undefined : pageParam + 1;

        return { items, nextPage };
    }

    /**
     * 게시물의 댓글을 무한 스크롤로 가져옵니다.
     *
     * @param userId - 현재 사용자의 ID입니다.
     * @param postId - 게시물의 ID입니다.
     * @param pageParam - 현재 페이지 번호입니다.
     * @param limitSize - 한 페이지당 가져올 댓글 수입니다.
     * @returns 가져온 댓글과 다음 페이지 번호를 반환합니다.
     */
    async getCommentsInfiniteScroll(userId: string, postId: string, pageParam: number, limitSize: number) {
        const typeIds = await this.reportSearcherService.findTypeIdList(userId, ReportShareContentType.COMMENT);
        const blockedIds = await this.reportSearcherService.getUserBlockedIds(userId);

        const comments = await this.shareCommentRepository
            .find({ _id: { $nin: typeIds }, postId, userId: { $nin: blockedIds }, isDeleted: false })
            .populate({
                path: 'userId',
                select: 'nickname imageId',
                populate: { path: 'imageId', model: 'Image', select: 'imageKey -_id' },
            })
            .sort({ createdAt: -1 })
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
                        createdAt: comment.createdAt,
                        replyCount: comment.id && (await this.getCommentReplyCount(comment.id, userId)),
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

    /**
     * 댓글에 대한 답글을 무한 스크롤로 가져옵니다.
     *
     * @param userId - 현재 사용자의 ID입니다.
     * @param commentId - 댓글의 ID입니다.
     * @param pageParam - 현재 페이지 번호입니다.
     * @param limitSize - 한 페이지당 가져올 답글 수입니다.
     * @returns 가져온 답글과 다음 페이지 번호를 반환합니다.
     */
    async getCommentRepliesInfiniteScroll(userId: string, commentId: string, pageParam: number, limitSize: number) {
        const typeIds = await this.reportSearcherService.findTypeIdList(userId, ReportShareContentType.REPLY);
        const blockedIds = await this.reportSearcherService.getUserBlockedIds(userId);

        const commentReplies = await this.shareCommentReplyRepository
            .find({ _id: { $nin: typeIds }, userId: { $nin: blockedIds }, commentId, isDeleted: false })
            .populate({
                path: 'userId',
                select: 'nickname imageId',
                populate: { path: 'imageId', model: 'Image', select: 'imageKey -_id' },
            })
            .sort({ createdAt: -1 })
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
                        createdAt: cmmentReply.createdAt,
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

    /**
     * 게시물에 대한 좋아요를 무한 스크롤로 가져옵니다.
     *
     * @param userId - 현재 사용자의 ID입니다.
     * @param postId - 게시물의 ID입니다.
     * @param pageParam - 현재 페이지 번호입니다.
     * @param limitSize - 한 페이지당 가져올 좋아요 수입니다.
     * @returns 가져온 좋아요 정보와 다음 페이지 번호를 반환합니다.
     */
    async getLikeListForPostInfiniteScroll(userId: string, postId: string, pageParam: number, limitSize: number) {
        try {
            const blockedIds = await this.reportSearcherService.getUserBlockedIds(userId);

            const likes = await this.shareLikeRepository.getAggregatedLikeList(
                postId,
                userId,
                blockedIds,
                pageParam,
                limitSize,
            );

            const items = await Promise.all(
                likes.map(async (entity) => {
                    const isMine = entity.isMine;
                    const currentUserId = isMine ? undefined : userId;
                    const isFollow = currentUserId
                        ? await this.userSearcherService.isExistsFollow(currentUserId, entity.userId)
                        : undefined;

                    return {
                        user: {
                            id: String(entity.userId),
                            nickname: entity.userDetails.nickname,
                            profile: {
                                src: `${process.env.AWS_IMAGE_BASEURL}${entity.userImage.imageKey}`,
                            },
                            isFollow,
                            isMine,
                        },
                    };
                }),
            );

            const isLastPage = likes.length < limitSize;
            const nextPage = isLastPage ? undefined : pageParam + 1;

            return { items, nextPage };
        } catch (error) {
            throw new CustomExceptionHandler(error).handleException('Invalid ObjectId for share post Id.', -2504);
        }
    }

    /**
     * 무한 스크롤로 사용자 자신의 게시물을 가져옵니다.
     *
     * @param userId - 현재 사용자의 ID입니다.
     * @param pageParam - 현재 페이지 번호입니다.
     * @param limitSize - 한 페이지당 가져올 게시물 수입니다.
     * @returns 가져온 게시물과 다음 페이지 번호를 반환합니다.
     */
    async getMyPostsInfiniteScroll(userId: string, pageParam: number, limitSize: number) {
        const posts = await this.sharePostRepository
            .find({ userId, isDeleted: false })
            .sort({ createdAt: -1 })
            .skip(pageParam * limitSize)
            .limit(limitSize)
            .exec();

        const items = await Promise.all(
            posts.map(async (entity) => {
                const post = entity.Mapper();
                const images = post.id && (await this.imageSearcherService.getPostImages(post.id));

                return {
                    post: {
                        id: post.id,
                        contents: post.contents,
                        createdAt: post.createdAt,
                        images,
                        isMine: true,
                        isLike: post.id ? await this.isExistsLike(userId, post?.id) : undefined,
                        likeCount: post.id && (await this.getLikeCount(userId, post.id)),
                        commentCount: post.id && (await this.getCommentCount(post.id, userId)),
                    },
                };
            }),
        );

        const isLastPage = posts.length < limitSize;
        const nextPage = isLastPage ? undefined : pageParam + 1;

        return { items, nextPage };
    }

    /**
     *    여러 곳에서 공유되는 함수들 모음
     *
     *
     */

    /**
     * 게시물 정보를 조회하고 반환합니다.
     *
     * @param option PostOption 객체로 게시물의 생성, 업데이트 또는 삭제 여부를 결정합니다.
     * @returns 게시물 정보 객체를 반환합니다.
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
                mappedPost?.id && this.getLikeCount(mappedPost.userId, mappedPost.id),
                mappedPost?.id && this.getCommentCount(mappedPost.id, mappedPost.userId),
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

    /**
     * 댓글 정보를 조회하고 반환합니다.
     *
     * @param option CommentOption 객체로 게시물의 생성, 업데이트 또는 삭제 여부를 결정합니다.
     * @returns 댓글 정보 객체를 반환합니다.
     */
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

    /**
     * 대댓글 정보를 조회하고 반환합니다.
     *
     * @param option CommentReplyOption 객체로 게시물의 생성, 업데이트 또는 삭제 여부를 결정합니다.
     * @returns 대댓글 정보 객체를 반환합니다.
     */
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

    /**
     * 게시물 좋아요 상태를 조회하고 반환합니다.
     *
     * @param postId 게시물 ID
     * @param userId 사용자 ID
     * @returns 게시물 좋아요 상태 및 게시물 작성자의 닉네임 정보를 반환합니다.
     */
    async getLikeStatus(postId: string, userId: string) {
        try {
            const like = await this.shareLikeRepository
                .findOne({ userId, postId })
                .populate({ path: 'postId', select: 'userId', populate: { path: 'userId', select: 'nickname -_id' } })
                .exec();

            if (!like) {
                throw new CustomException('Not found for the specified share like status.', HttpStatus.NOT_FOUND, -2303);
            }

            return { ...like.Mapper(), postId: Object(like.postId).Mapper() };
        } catch (error) {
            throw new CustomExceptionHandler(error).handleException('Invalid ObjectId for share post Id.', -2504);
        }
    }

    /**
     * 지정된 사용자와 게시물에 대한 좋아요 상태가 존재하는지 확인하고 반환합니다.
     *
     * @param userId 사용자 ID
     * @param postId 게시물 ID
     * @returns 좋아요 상태 여부 (존재하는 경우 true, 없는 경우 false, 알 수 없는 경우 undefined)
     */
    async isExistsLike(userId: SchemaId, postId: string): Promise<boolean | undefined> {
        const like = await this.shareLikeRepository.findOne({ userId, postId }).exec();
        return like ? (like.isCanceled ? false : true) : undefined;
    }

    /**
     * 지정된 게시물 ID를 기반으로 게시물을 검색하고 반환합니다.
     *
     * @param postId 게시물 ID
     * @returns 검색된 게시물 정보를 반환합니다.
     */
    async findPostWithUserInfo(postId: string) {
        try {
            const post = await this.sharePostRepository
                .findOne({ _id: postId, isDeleted: false })
                .populate({ path: 'userId', select: 'nickname fcmToken' })
                .exec();

            if (!post) {
                throw new CustomException('Not found for the specified share Post Id.', HttpStatus.NOT_FOUND, -2301);
            }

            return { ...post.Mapper(), userId: Object(post.userId).Mapper() };
        } catch (error) {
            throw new CustomExceptionHandler(error).handleException('Invalid ObjectId for share post Id.', -2504);
        }
    }

    /**
     * 지정된 댓글 ID를 기반으로 댓글을 검색하고 반환합니다.
     *
     * @param commentId 댓글 ID
     * @returns 검색된 댓글 정보를 반환합니다.
     */
    async findCommentWithUserInfo(commentId: string) {
        try {
            const comment = await this.shareCommentRepository
                .findOne({ _id: commentId, isDeleted: false })
                .populate({ path: 'userId', select: 'nickname fcmToken' })
                .exec();

            if (!comment) {
                throw new CustomException('Not found for the specified share comment Id.', HttpStatus.NOT_FOUND, -2302);
            }

            return { ...comment.Mapper(), userId: Object(comment.userId).Mapper() };
        } catch (error) {
            throw new CustomExceptionHandler(error).handleException('Invalid ObjectId for share comment Id.', -2505);
        }
    }

    /**
     * 지정된 댓글 ID를 기반으로 댓글을 검색하고 반환합니다.
     *
     * @param postId 게시글 ID
     * @returns 검색된 댓글 정보를 반환합니다.
     */
    async findPost(postId: string) {
        try {
            const post = await this.sharePostRepository.findOne({ _id: postId, isDeleted: false }).exec();

            if (!post) {
                throw new CustomException('Not found for the specified share post Id.', HttpStatus.NOT_FOUND, -2301);
            }

            return post.Mapper();
        } catch (error) {
            throw new CustomExceptionHandler(error).handleException('Invalid ObjectId for share post Id.', -2504);
        }
    }

    /**
     * 지정된 댓글 ID를 기반으로 댓글을 검색하고 반환합니다.
     *
     * @param commentId 댓글 ID
     * @returns 검색된 댓글 정보를 반환합니다.
     */
    async findComment(commentId: string) {
        try {
            const comment = await this.shareCommentRepository.findOne({ _id: commentId, isDeleted: false }).exec();

            if (!comment) {
                throw new CustomException('Not found for the specified share comment Id.', HttpStatus.NOT_FOUND, -2302);
            }

            return comment.Mapper();
        } catch (error) {
            throw new CustomExceptionHandler(error).handleException('Invalid ObjectId for share comment Id.', -2505);
        }
    }

    /**
     * 지정된 대댓글 ID를 기반으로 댓글을 검색하고 반환합니다.
     *
     * @param replyId 대댓글 ID
     * @returns 검색된 대댓글 정보를 반환합니다.
     */
    async findCommentReply(replyId: string) {
        try {
            const reply = await this.shareCommentReplyRepository.findOne({ _id: replyId, isDeleted: false }).exec();

            if (!reply) {
                throw new CustomException('Not found for the specified share comment reply Id.', HttpStatus.NOT_FOUND, -2304);
            }

            return reply.Mapper();
        } catch (error) {
            throw new CustomExceptionHandler(error).handleException('Invalid ObjectId for share comment reply Id.', -2506);
        }
    }

    /**
     * 지정된 게시물 ID에 대한 좋아요 수를 반환합니다.
     *
     * @param postId 게시물 ID
     * @returns 좋아요 수를 반환합니다.
     */
    async getLikeCount(userId: SchemaId, postId: string): Promise<number> {
        const blockedIds = await this.reportSearcherService.getUserBlockedIds(userId);
        return this.shareLikeRepository.countDocuments({ postId, userId: { $nin: blockedIds }, isCanceled: false }).exec();
    }

    /**
     * 지정된 게시물 ID에 모든 좋아요 수를 반환합니다.
     *
     * @param postId 게시물 ID
     * @returns 좋아요 수를 반환합니다.
     */
    async getLikeAllCount(postId: string): Promise<number> {
        return this.shareLikeRepository.countDocuments({ postId, isCanceled: false }).exec();
    }

    /**
     * 유저의 생성한 게시물에 대한 수를 반환합니다.
     *
     * @param nickname 게시물 ID
     * @param currentUserId 유저 ID
     * @returns 댓글 수를 반환합니다.
     */
    async getPostAndFollowerCount(currentUserId: string, nickname: string) {
        const targetUserInfo = await this.userSearcherService.findNickname(nickname);
        const typeIds = currentUserId
            ? await this.reportSearcherService.findTypeIdList(currentUserId, ReportShareContentType.POST)
            : undefined;

        const postCount = await this.sharePostRepository
            .countDocuments({ _id: { $nin: typeIds }, userId: targetUserInfo.id, isDeleted: false })
            .exec();

        const { followerCount, followingCount } = await this.userSearcherService.getFollowCount(targetUserInfo.id as string);

        return { postCount, followerCount, followingCount };
    }

    /**
     * 지정된 게시물 ID에 대한 댓글 수를 반환합니다.
     *
     * @param postId 게시물 ID
     * @param currentUserId 유저 ID
     * @returns 댓글 수를 반환합니다.
     */
    async getCommentCount(postId: string, currentUserId: SchemaId): Promise<number> {
        const typeIds = await this.reportSearcherService.findTypeIdList(currentUserId, ReportShareContentType.COMMENT);
        const blockedIds = await this.reportSearcherService.getUserBlockedIds(currentUserId);

        return this.shareCommentRepository
            .countDocuments({ _id: { $nin: typeIds }, postId, userId: { $nin: blockedIds }, isDeleted: false })
            .exec();
    }

    /**
     * 지정된 댓글 ID에 대한 답글 수를 반환합니다.
     *
     * @param commentId 댓글 ID
     * @param currentUserId 유저 ID
     * @returns 답글 수를 반환합니다.
     */
    async getCommentReplyCount(commentId: string, currentUserId: string): Promise<number> {
        const typeIds = await this.reportSearcherService.findTypeIdList(currentUserId, ReportShareContentType.REPLY);
        const blockedIds = await this.reportSearcherService.getUserBlockedIds(currentUserId);

        return this.shareCommentReplyRepository
            .countDocuments({ _id: { $nin: typeIds }, userId: { $nin: blockedIds }, commentId, isDeleted: false })
            .exec();
    }

    /**
     * 지정된 댓글 ID에 대한 모든 답글 수를 반환합니다.
     *
     * @param commentId 댓글 ID
     * @param currentUserId 유저 ID
     * @returns 답글 수를 반환합니다.
     */
    async getCommentReplyAllCount(commentId: string): Promise<number> {
        return this.shareCommentReplyRepository.countDocuments({ commentId, isDeleted: false }).exec();
    }

    /**
     * 지정된 유저에 대한 게시글 ID 목록을 반환합니다.
     *
     * @param userId 게시물 ID
     * @returns 댓글 ID 목록를 반환합니다.
     */
    async getPostIds(userId: string): Promise<string[]> {
        const posts = await this.sharePostRepository.find({ userId, isDeleted: false }, { _id: 1 }).exec();
        return posts?.map((entity) => entity.Mapper().id as string);
    }

    /**
     * 지정된 복원해야할 유저에 대한 게시글 ID 목록을 반환합니다.
     *
     * @param userId 게시물 ID
     * @returns 댓글 ID 목록를 반환합니다.
     */
    async getRestorePostIds(userId: string): Promise<string[]> {
        const posts = await this.sharePostRepository.find({ userId, isDeleted: true }, { _id: 1 }).exec();
        return posts?.map((entity) => entity.Mapper().id as string);
    }

    /**
     * 지정된 게시물 ID에 대한 댓글 ID 목록을 반환합니다.
     *
     * @param postId 게시물 ID
     * @returns 댓글 ID 목록를 반환합니다.
     */
    async getCommentIds(postIds: string[]): Promise<string[]> {
        const comments = await this.shareCommentRepository
            .find({ postId: { $in: postIds }, isDeleted: false }, { _id: 1 })
            .exec();
        return comments?.map((entity) => entity.Mapper().id as string);
    }

    /**
     * 지정된 복원해야할 유저에 대한 댓글 ID 목록을 반환합니다.
     *
     * @param userId 게시물 ID
     * @returns 댓글 ID 목록를 반환합니다.
     */
    async getRestoreCommentIds(postIds: string[]): Promise<string[]> {
        const comments = await this.shareCommentRepository
            .find({ postId: { $in: postIds }, isDeleted: true }, { _id: 1 })
            .exec();
        return comments?.map((entity) => entity.Mapper().id as string);
    }

    async extractUserInfo(input: string) {
        const regex = /@(\S+)/g;
        const matches = input.match(regex)?.map((match) => match.slice(1));

        return matches ? await this.userSearcherService.extractUserInfo(matches) : undefined;
    }
}
