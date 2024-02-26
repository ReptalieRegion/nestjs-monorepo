import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ITempUser, UserActivityType } from '@private-crawl/types';
import mongoose, { ClientSession } from 'mongoose';
import { ImageType } from '../../../dto/image/input-image.dto';
import { TemplateType } from '../../../dto/notification/template/input-notificationTemplate.dto';
import { IUserProfileDTO } from '../../../dto/user/user/user-profile.dto';
import { CustomException } from '../../../utils/error/customException';
import { CustomExceptionHandler } from '../../../utils/error/customException.handler';
import { disassembleHangulToGroups } from '../../../utils/hangul/disassemble';
import { ImageSearcherService, ImageSearcherServiceToken } from '../../image/service/imageSearcher.service';
import { ImageUpdaterService, ImageUpdaterServiceToken } from '../../image/service/imageUpdater.service';
import { ImageWriterService, ImageWriterServiceToken } from '../../image/service/imageWriter.service';
import { NotificationAgreeService, NotificationAgreeServiceToken } from '../../notification/service/notificationAgree.service';
import { NotificationPushService, NotificationPushServiceToken } from '../../notification/service/notificationPush.service';
import { NotificationSlackService, NotificationSlackServiceToken } from '../../notification/service/notificationSlack.service';
import { ReportSearcherService, ReportSearcherServiceToken } from '../../report/service/reportSearcher.service';
import { UserActivityLogService, UserActivityLogServiceToken } from '../../user-activity-log/userActivityLog.service';
import { FollowRepository } from '../repository/follow.repository';
import { UserRepository } from '../repository/user.repository';
import { UserSearcherService, UserSearcherServiceToken } from './userSearcher.service';
import { UserUpdaterService, UserUpdaterServiceToken } from './userUpdater.service';

export const UserWriterServiceToken = 'UserWriterServiceToken';

@Injectable()
export class UserWriterService {
    constructor(
        private readonly followRepository: FollowRepository,
        private readonly userRepository: UserRepository,

        @Inject(UserSearcherServiceToken)
        private readonly userSearcherService: UserSearcherService,
        @Inject(UserUpdaterServiceToken)
        private readonly userUpdaterService: UserUpdaterService,
        @Inject(ImageWriterServiceToken)
        private readonly imageWriterService: ImageWriterService,
        @Inject(ImageSearcherServiceToken)
        private readonly imageSearcherService: ImageSearcherService,
        @Inject(ImageUpdaterServiceToken)
        private readonly imageUpdaterService: ImageUpdaterService,

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
     * 새로운 사용자를 생성하고 필요한 작업을 수행합니다.
     *
     * @param session MongoDB 클라이언트 세션
     * @returns 생성된 사용자 객체를 반환합니다.
     */
    async createUser(session: ClientSession) {
        const nickname = await this.userSearcherService.generateAvailableNickname();
        const { USER_BASE_IMAGE } = process.env;

        const imageKeys = [USER_BASE_IMAGE as string];

        const user = await this.userRepository.createUser(
            { nickname, imageId: String(new mongoose.Types.ObjectId()) },
            session,
        );

        if (!user) {
            throw new CustomException('Failed to save user.', HttpStatus.INTERNAL_SERVER_ERROR, -1610);
        }

        const [image] = await this.imageWriterService.createImage(user.id as string, imageKeys, ImageType.Profile, session);
        await this.userUpdaterService.updateImageId(user.id as string, image.id as string, session);

        return user;
    }

    /**
     * 회원탈퇴한 유저를 복원 작업을 수행합니다.
     *
     * @param session MongoDB 클라이언트 세션
     * @returns 생성된 사용자 객체를 반환합니다.
     */
    async restoreUser(userInfo: Partial<ITempUser>, session: ClientSession, name?: string, phone?: string, address?: string) {
        const image = await this.imageSearcherService.getProfileImages(userInfo.userId as string);
        const initials = disassembleHangulToGroups(userInfo.nickname as string)
            .flatMap((values) => values[0])
            .join('');

        const user = await this.userRepository.createUser(
            { nickname: userInfo.nickname as string, imageId: image.id, name, phone, address, initials },
            session,
        );

        await this.imageUpdaterService.updateImage(image.id as string, user.id as string, session);

        return user;
    }

    /**
     * 팔로우 관계를 생성합니다.
     *
     * @param following 팔로우하는 사용자의 ID
     * @param follower 팔로우하는 사용자의 ID
     * @returns 생성된 팔로우 관계 정보를 반환합니다.
     */
    async createFollow(following: IUserProfileDTO, follower: string) {
        if (following.id === follower) {
            throw new CustomException('following and follower cannot be the same user.', HttpStatus.BAD_REQUEST, -1001);
        }

        try {
            const followerInfo = await this.userSearcherService.findUserId(follower);
            const followerNickname = followerInfo?.nickname as string;
            const initials = followerInfo?.initials as string;

            const follow = await this.followRepository.createFollow({
                following: following.id,
                follower,
                followerNickname,
                initials,
            });

            if (!follow) {
                throw new CustomException('Failed to save follow.', HttpStatus.INTERNAL_SERVER_ERROR, -1601);
            }

            /**
             * 푸시 알림 전송
             */
            Promise.all([
                this.notificationAgreeService.isPushAgree(TemplateType.Follow, follower),
                this.reportSearcherService.isBlockedUser(follower, following.id),
            ])
                .then(async ([isPushAgree, isBlockedUser]) => {
                    if (!isPushAgree || isBlockedUser) {
                        return;
                    }

                    const userThumbnail = following.profile.src;

                    if (!userThumbnail) {
                        throw new Error(
                            '[CRAWL] Not Found postThumbnail or userThumbnail\n' +
                                `userThumbnail: ${userThumbnail}\n` +
                                `userId: ${follower}`,
                        );
                    }

                    await this.notificationPushService.sendMessage(followerInfo?.fcmToken, {
                        type: TemplateType.Follow,
                        userId: follower,
                        userNickname: following.nickname,
                        userThumbnail,
                        articleParams: {
                            팔로우한회원: following.nickname,
                        },
                    });
                })
                .catch((error) => {
                    this.notificationSlackService.send(`*[푸시 알림]* 이미지 찾기 실패\n${error.message}`, '푸시알림-에러-dev');
                });

            this.userActivityLogService.createActivityLog({
                userId: following.id,
                activityType: UserActivityType.FOLLOW_CREATED,
                details: JSON.stringify({
                    following: {
                        id: following.id,
                    },
                    follower: {
                        id: follower,
                    },
                }),
            });

            return { user: { nickname: follow.followerNickname } };
        } catch (error) {
            throw new CustomExceptionHandler(error).handleException('following and follower should be unique values.', -1602);
        }
    }
}
