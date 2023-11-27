import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
    UnprocessableEntityException,
} from '@nestjs/common';
import mongoose, { ClientSession } from 'mongoose';
import { ImageType } from '../../../dto/image/input-image.dto';
import { TemplateType } from '../../../dto/notification/template/input-notificationTemplate.dto';
import { IUserProfileDTO } from '../../../dto/user/user/response-user.dto';
import { serviceErrorHandler } from '../../../utils/error/errorHandler';
import { randomWords } from '../../../utils/randomWords/randomWords';
import { ImageWriterService, ImageWriterServiceToken } from '../../image/service/imageWriter.service';
import { NotificationAgreeService, NotificationAgreeServiceToken } from '../../notification/service/notificationAgree.service';
import { NotificationPushService, NotificationPushServiceToken } from '../../notification/service/notificationPush.service';
import { NotificationSlackService, NotificationSlackServiceToken } from '../../notification/service/notificationSlack.service';
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

        @Inject(NotificationAgreeServiceToken)
        private readonly notificationAgreeService: NotificationAgreeService,
        @Inject(NotificationPushServiceToken)
        private readonly notificationPushService: NotificationPushService,
        @Inject(NotificationSlackServiceToken)
        private readonly notificationSlackService: NotificationSlackService,
    ) {}

    /**
     * 새로운 사용자를 생성하고 필요한 작업을 수행합니다.
     *
     * @param session MongoDB 클라이언트 세션
     * @returns 생성된 사용자 객체를 반환합니다.
     */
    async createUser(session: ClientSession) {
        const nickname = await this.generateAvailableNickname();
        const imageKeys = ['6f433309-a36b-4498-b819-48ace2d19c7f.jpeg'];

        const user = await this.userRepository.createUser(
            { nickname, imageId: String(new mongoose.Types.ObjectId()) },
            session,
        );

        if (!user) {
            throw new InternalServerErrorException('Failed to save user.');
        }

        const [image] = await this.imageWriterService.createImage(user.id as string, imageKeys, ImageType.Profile, session);
        await this.userUpdaterService.updateImageId(user.id as string, image.id as string, session);

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
            throw new BadRequestException('Following and follower cannot be the same user.');
        }

        try {
            const followerInfo = await this.userSearcherService.findUserId(follower);
            const followerNickname = followerInfo?.nickname as string;

            const follow = await this.followRepository.createFollow({ following: following.id, follower, followerNickname });

            if (!follow) {
                throw new InternalServerErrorException('Failed to save follow.');
            }

            /**
             * 푸시 알림 전송
             */
            Promise.all([this.notificationAgreeService.isPushAgree(TemplateType.Follow, follower)])
                .then(async ([isPushAgree]) => {
                    if (!isPushAgree) {
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

            return { user: { nickname: follow.followerNickname } };
        } catch (error) {
            serviceErrorHandler(error, 'following and follower should be unique values.');
        }
    }

    /**
     * 이용 가능한 닉네임을 생성합니다.
     *
     * @returns 생성된 닉네임을 반환합니다.
     */
    async generateAvailableNickname(): Promise<string> {
        for (let i = 0; i < 15; i++) {
            const baseNickname = this.generateRandomNickname();
            const nicknameToCheck = i < 5 ? baseNickname : `${baseNickname}${i - 5}`;

            const isDuplicate = await this.userSearcherService.isDuplicateNickname(nicknameToCheck);
            if (!isDuplicate.isDuplicate) {
                return nicknameToCheck;
            }
        }

        throw new UnprocessableEntityException('Too many requests to generate a nickname.');
    }

    /**
     * 무작위 닉네임을 생성합니다.
     *
     * @returns 생성된 닉네임을 반환합니다.
     */
    private generateRandomNickname(): string {
        const { adverbs, adjectives, nouns } = randomWords;

        const getRandomWord = (wordList: string[]): string => {
            const randomIndex = Math.floor(Math.random() * wordList.length);
            return wordList[randomIndex];
        };

        const randomAdv = getRandomWord(adverbs);
        const randomAdj = getRandomWord(adjectives);
        const randomNoun = getRandomWord(nouns);

        const shortNickname = randomAdj + randomNoun;
        const longNickname = randomAdv + shortNickname;

        return longNickname.length > 8 ? shortNickname : longNickname;
    }
}
