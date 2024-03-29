import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { UserActivityType } from '@private-crawl/types';
import mongoose, { ClientSession } from 'mongoose';
import { ImageType } from '../../../dto/image/input-image.dto';
import { TemplateType } from '../../../dto/notification/template/input-notificationTemplate.dto';
import { InputShareCommentDTO } from '../../../dto/share/comment/input-shareComment.dto';
import { InputShareCommentReplyDTO } from '../../../dto/share/commentReply/input-shareCommentReply.dto';
import { InputSharePostDTO } from '../../../dto/share/post/input-sharePost.dto';
import { IUserProfileDTO } from '../../../dto/user/user/user-profile.dto';
import { CustomException } from '../../../utils/error/customException';
import { CustomExceptionHandler } from '../../../utils/error/customException.handler';
import { ImageS3HandlerService, ImageS3HandlerServiceToken } from '../../image/service/imageS3Handler.service';
import { ImageSearcherService, ImageSearcherServiceToken } from '../../image/service/imageSearcher.service';
import { ImageWriterService, ImageWriterServiceToken } from '../../image/service/imageWriter.service';
import { NotificationAgreeService, NotificationAgreeServiceToken } from '../../notification/service/notificationAgree.service';
import { NotificationPushService, NotificationPushServiceToken } from '../../notification/service/notificationPush.service';
import { NotificationSlackService, NotificationSlackServiceToken } from '../../notification/service/notificationSlack.service';
import { ReportSearcherService, ReportSearcherServiceToken } from '../../report/service/reportSearcher.service';
import { UserActivityLogService, UserActivityLogServiceToken } from '../../user-activity-log/userActivityLog.service';
import { ShareCommentRepository } from '../repository/shareComment.repository';
import { ShareCommentReplyRepository } from '../repository/shareCommentReply.repository';
import { ShareLikeRepository } from '../repository/shareLike.repository';
import { SharePostRepository } from '../repository/sharePost.repository';
import { ShareSearcherService, ShareSearcherServiceToken } from './shareSearcher.service';

export const ShareWriterServiceToken = 'ShareWriterServiceToken';

@Injectable()
export class ShareWriterService {
    private readonly MAX_REPORT_LIMIT = 5;

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
        @Inject(ImageSearcherServiceToken)
        private readonly imageSearcherService: ImageSearcherService,

        @Inject(ShareSearcherServiceToken)
        private readonly shareSearcherService: ShareSearcherService,

        @Inject(NotificationAgreeServiceToken)
        private readonly notificationAgreeService: NotificationAgreeService,
        @Inject(NotificationPushServiceToken)
        private readonly notificationPushService: NotificationPushService,
        @Inject(NotificationSlackServiceToken)
        private readonly notificationSlackService: NotificationSlackService,

        @Inject(ReportSearcherServiceToken)
        private readonly reportSearcherService: ReportSearcherService,

        @Inject(UserActivityLogServiceToken)
        private readonly userActivityLogService: UserActivityLogService,
    ) {}

    /**
     * 이미지를 포함한 새로운 게시물을 생성합니다.
     *
     * @param user - 게시물을 생성하는 사용자입니다.
     * @param dto - 게시물의 세부 정보를 담고 있는 데이터 전송 객체입니다.
     * @param files - 게시물과 연결될 이미지 파일들의 배열입니다.
     * @returns 생성된 게시물과 사용자 정보를 반환합니다.
     */
    async createPostWithImages(user: IUserProfileDTO, dto: InputSharePostDTO, files: Express.Multer.File[]) {
        await this.isReportLimitExceeded(user.id);

        const session: ClientSession = await this.connection.startSession();
        session.startTransaction();

        let imageKeys: string[] = [];

        try {
            const tagUserInfo = await this.shareSearcherService.extractUserInfo(dto.contents);

            const post = await this.sharePostRepository.createPost(user.id, dto, session);

            if (!post) {
                throw new CustomException('Failed to save share post.', HttpStatus.INTERNAL_SERVER_ERROR, -2601);
            }

            imageKeys = await this.imageS3HandlerService.uploadToS3(files);

            await this.imageWriterService.createImage(post.id, imageKeys, ImageType.Share, session);

            await session.commitTransaction();

            const postInfo = await this.shareSearcherService.getPostInfo({ create: { post, imageKeys } });

            tagUserInfo?.map((entity) => {
                Promise.all([
                    this.notificationAgreeService.isPushAgree(TemplateType.Tag, entity.id as string),
                    this.reportSearcherService.isBlockedUser(entity.id as string, user.id),
                ])
                    .then(async ([isPushAgree, isTagBlockedUser]) => {
                        if (!isPushAgree || isTagBlockedUser) {
                            return;
                        }

                        const postThumbnail = `${process.env.AWS_IMAGE_BASEURL}${imageKeys[0]}`;
                        const userThumbnail = user.profile.src;

                        if (!postThumbnail || !userThumbnail) {
                            throw new Error(
                                '[CRAWL] Not Found postThumbnail or userThumbnail\n' +
                                    `postThumbnail: ${postThumbnail}\n` +
                                    `userThumbnail: ${userThumbnail}\n` +
                                    `postId: ${post.id}\n` +
                                    `userId: ${entity?.id}`,
                            );
                        }

                        await this.notificationPushService.sendMessage(entity.fcmToken, {
                            type: TemplateType.Tag,
                            userId: entity.id as string,
                            postId: post.id,
                            postThumbnail,
                            userThumbnail,
                            articleParams: { 태그한유저: user.nickname },
                        });
                    })
                    .catch((error) => {
                        this.notificationSlackService.send(
                            `*[푸시 알림]* 이미지 찾기 실패\n${error.message}`,
                            '푸시알림-에러-dev',
                        );
                    });
            });

            this.userActivityLogService.createActivityLog({
                userId: user.id,
                activityType: UserActivityType.POST_CREATED,
                details: JSON.stringify({ post: { id: post.id, contents: post.contents } }),
            });

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
    async createComment(user: IUserProfileDTO, dto: InputShareCommentDTO) {
        await this.isReportLimitExceeded(user.id);

        const post = await this.shareSearcherService.findPostWithUserInfo(dto.postId);
        const tagUserInfo = await this.shareSearcherService.extractUserInfo(dto.contents);

        const comment = await this.shareCommentRepository.createComment(user.id, dto);

        if (!comment) {
            throw new CustomException('Failed to save share comment.', HttpStatus.INTERNAL_SERVER_ERROR, -2602);
        }

        const commentInfo = await this.shareSearcherService.getCommentInfo({ create: { comment } });

        /**
         * 푸시 알림 전송
         */
        Promise.all([
            this.notificationAgreeService.isPushAgree(TemplateType.Comment, post?.userId.id),
            this.imageSearcherService.getPostImages(comment.postId),
            this.reportSearcherService.isBlockedUser(post?.userId.id, user.id),
        ])
            .then(async ([isCommentPushAgree, postImage, isBlockedUser]) => {
                const postThumbnail = postImage[0].src;
                const userThumbnail = user.profile.src;

                if (!postThumbnail || !userThumbnail) {
                    throw new Error(
                        '[CRAWL] Not Found postThumbnail or userThumbnail\n' +
                            `postThumbnail: ${postThumbnail}\n` +
                            `userThumbnail: ${userThumbnail}\n` +
                            `postId: ${comment.postId}\n` +
                            `userId: ${post?.userId.id}`,
                    );
                }

                if (post?.userId.id !== user.id && isCommentPushAgree && !isBlockedUser) {
                    await this.notificationPushService.sendMessage(post?.userId.fcmToken, {
                        type: TemplateType.Comment,
                        userId: post?.userId.id,
                        postId: comment.postId,
                        postThumbnail,
                        userThumbnail,
                        articleParams: { 댓글생성한유저: user.nickname },
                    });
                }

                if (tagUserInfo?.length) {
                    await Promise.all(
                        tagUserInfo.map(async (entity) => {
                            const [isTagPushAgree, isTagBlockedUser] = await Promise.all([
                                this.notificationAgreeService.isPushAgree(TemplateType.Tag, entity.id as string),
                                this.reportSearcherService.isBlockedUser(entity.id as string, user.id),
                            ]);

                            if (post?.userId.id !== entity.id && isTagPushAgree && !isTagBlockedUser) {
                                await this.notificationPushService.sendMessage(entity.fcmToken, {
                                    type: TemplateType.Tag,
                                    userId: entity.id as string,
                                    postId: comment.postId,
                                    postThumbnail,
                                    userThumbnail,
                                    articleParams: { 태그한유저: user.nickname },
                                });
                            }
                        }),
                    );
                }
            })
            .catch((error) => {
                this.notificationSlackService.send(`*[푸시 알림]* 이미지 찾기 실패\n${error.message}`, '푸시알림-에러-dev');
            });

        this.userActivityLogService.createActivityLog({
            userId: user.id,
            activityType: UserActivityType.COMMENT_CREATED,
            details: JSON.stringify({ comment: { id: comment.id, contents: comment.contents } }),
        });
        return { post: { id: comment.postId, comment: { ...commentInfo, user } } };
    }

    /**
     * 댓글에 대한 답글을 생성합니다.
     *
     * @param user - 댓글에 대한 답글을 생성하는 사용자입니다.
     * @param dto - 댓글에 대한 답글의 세부 정보를 담고 있는 데이터 전송 객체입니다.
     * @returns 생성된 댓글에 대한 답글과 사용자 정보를 반환합니다.
     */
    async createCommentReply(user: IUserProfileDTO, dto: InputShareCommentReplyDTO) {
        await this.isReportLimitExceeded(user.id);

        const comment = await this.shareSearcherService.findCommentWithUserInfo(dto.commentId);
        const tagUserInfo = await this.shareSearcherService.extractUserInfo(dto.contents);

        const commentReply = await this.shareCommentReplyRepository.createCommentReply(user.id, dto);

        if (!commentReply.id) {
            throw new CustomException('Failed to save share comment reply.', HttpStatus.INTERNAL_SERVER_ERROR, -2603);
        }

        const commentReplyInfo = await this.shareSearcherService.getCommentReplyInfo({ create: { commentReply } });

        /**
         * 푸시 알림 전송
         */
        Promise.all([
            this.notificationAgreeService.isPushAgree(TemplateType.Comment, comment?.userId.id),
            this.imageSearcherService.getPostImages(comment?.postId as string),
            this.reportSearcherService.isBlockedUser(comment?.userId.id, user.id),
        ])
            .then(async ([isCommentPushAgree, postImage, isBlockedUser]) => {
                const postThumbnail = postImage[0].src;
                const userThumbnail = user.profile.src;

                if (!postThumbnail || !userThumbnail) {
                    throw new Error(
                        '[CRAWL] Not Found postThumbnail or userThumbnail\n' +
                            `postThumbnail: ${postThumbnail}\n` +
                            `userThumbnail: ${userThumbnail}\n` +
                            `postId: ${comment?.postId}\n` +
                            `userId: ${comment?.userId.id}`,
                    );
                }

                if (comment?.userId.id !== user.id && isCommentPushAgree && !isBlockedUser) {
                    await this.notificationPushService.sendMessage(comment?.userId.fcmToken, {
                        type: TemplateType.Comment,
                        userId: comment?.userId.id,
                        postId: comment?.postId as string,
                        postThumbnail,
                        userThumbnail,
                        articleParams: { 댓글생성한유저: user.nickname },
                    });
                }

                if (tagUserInfo?.length) {
                    await Promise.all(
                        tagUserInfo.map(async (entity) => {
                            const [isTagPushAgree, isTagBlockedUser] = await Promise.all([
                                this.notificationAgreeService.isPushAgree(TemplateType.Tag, entity.id as string),
                                this.reportSearcherService.isBlockedUser(entity.id as string, user.id),
                            ]);

                            if (comment?.userId.id !== entity.id && isTagPushAgree && !isTagBlockedUser) {
                                await this.notificationPushService.sendMessage(entity.fcmToken, {
                                    type: TemplateType.Tag,
                                    userId: entity.id as string,
                                    postId: comment?.postId as string,
                                    postThumbnail,
                                    userThumbnail,
                                    articleParams: { 태그한유저: user.nickname },
                                });
                            }
                        }),
                    );
                }
            })
            .catch((error) => {
                this.notificationSlackService.send(`*[푸시 알림]* 이미지 찾기 실패\n${error.message}`, '푸시알림-에러-dev');
            });

        this.userActivityLogService.createActivityLog({
            userId: user.id,
            activityType: UserActivityType.REPLY_COMMENT_CREATED,
            details: JSON.stringify({ commentReply: { id: commentReply.id, contents: commentReply.contents } }),
        });
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
    async createLike(user: IUserProfileDTO, postId: string) {
        try {
            const post = await this.shareSearcherService.findPostWithUserInfo(postId);

            const like = await this.shareLikeRepository.createLike({ userId: user.id, postId });

            if (!like) {
                throw new CustomException('Failed to save share like.', HttpStatus.INTERNAL_SERVER_ERROR, -2604);
            }

            /**
             * 푸시 알림 전송
             */
            Promise.all([
                this.notificationAgreeService.isPushAgree(TemplateType.Like, post?.userId.id),
                this.imageSearcherService.getPostImages(post?.id as string),
                this.reportSearcherService.isBlockedUser(post?.userId.id, user.id),
            ])
                .then(async ([isPushAgree, postImage, isBlockedUser]) => {
                    if (post?.userId.id === user.id || !isPushAgree || isBlockedUser) {
                        return;
                    }

                    const postThumbnail = postImage[0].src;
                    const userThumbnail = user.profile.src;

                    if (!postThumbnail || !userThumbnail) {
                        throw new Error(
                            '[CRAWL] Not Found postThumbnail or userThumbnail\n' +
                                `postThumbnail: ${postThumbnail}\n` +
                                `userThumbnail: ${userThumbnail}\n` +
                                `postId: ${post?.id}\n` +
                                `userId: ${post?.userId.id}`,
                        );
                    }

                    await this.notificationPushService.sendMessage(post?.userId.fcmToken, {
                        type: TemplateType.Like,
                        userId: post?.userId.id,
                        postId: post?.id as string,
                        postThumbnail,
                        userThumbnail,
                        articleParams: {
                            좋아요한유저: user.nickname,
                        },
                    });
                })
                .catch((error) => {
                    this.notificationSlackService.send(`*[푸시 알림]* 이미지 찾기 실패\n${error.message}`, '푸시알림-에러-dev');
                });

            return { post: { id: like.postId, user: { nickname: post?.userId.nickname } } };
        } catch (error) {
            throw new CustomExceptionHandler(error).handleException('post and user Id should be unique values.', -2613);
        }
    }

    private async isReportLimitExceeded(userId: string) {
        const reportShareContentCount = await this.reportSearcherService.reportShareContentCount(userId);

        if (reportShareContentCount >= this.MAX_REPORT_LIMIT) {
            throw new CustomException(
                'The save operation has failed due to exceeding the maximum report limit.',
                HttpStatus.UNPROCESSABLE_ENTITY,
                -2507,
            );
        }
    }
}
