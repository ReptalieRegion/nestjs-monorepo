import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
    UnprocessableEntityException,
} from '@nestjs/common';
import mongoose, { ClientSession } from 'mongoose';
import { ImageType } from '../../../dto/image/input-image.dto';
import { serviceErrorHandler } from '../../../utils/error/errorHandler';
import { randomWords } from '../../../utils/randomNickname/randomWords';
import { ImageWriterService, ImageWriterServiceToken } from '../../image/service/imageWriter.service';
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
    ) {}

    /**
     * 새로운 사용자를 생성하고 필요한 작업을 수행합니다.
     *
     * @param session MongoDB 클라이언트 세션
     * @returns 생성된 사용자 객체를 반환합니다.
     */
    async createUser(session: ClientSession) {
        const nickname = await this.generateAvailableNickname();
        const imageKeys = ['5becb77c-bc1f-444b-8011-d77646f360dc.png'];

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
    async createFollow(following: string, follower: string) {
        if (following === follower) {
            throw new BadRequestException('Following and follower cannot be the same user.');
        }

        try {
            const followerInfo = await this.userSearcherService.findUserId(follower);
            const followerNickname = followerInfo?.nickname as string;

            const follow = await this.followRepository.createFollow({ following, follower, followerNickname });

            if (!follow) {
                throw new InternalServerErrorException('Failed to save follow.');
            }

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
