import { HttpStatus, Injectable } from '@nestjs/common';
import { IUserProfileDTO } from '../../../dto/user/user/response-user.dto';
import { User } from '../../../schemas/user.schema';
import { CustomException } from '../../../utils/error/customException';
import { CustomExceptionHandler } from '../../../utils/error/customException.handler';
import { disassembleHangulToGroups } from '../../../utils/hangul/disassemble';
import { randomWords } from '../../../utils/randomWords/randomWords';
import { FollowRepository } from '../repository/follow.repository';
import { UserRepository } from '../repository/user.repository';

export const UserSearcherServiceToken = 'UserSearcherServiceToken';

interface UserOption {
    targetUserId?: string;
    currentUserId?: string;
    nickname?: string;
    user?: User;
}

@Injectable()
export class UserSearcherService {
    constructor(private readonly userRepository: UserRepository, private readonly followRepository: FollowRepository) {}

    /**
     * 팔로워 목록을 페이지별로 무한 스크롤을 통해 검색합니다.
     *
     * @param following - 팔로워를 찾을 사용자 ID
     * @param search - 검색할 팔로워의 닉네임 일부
     * @param pageParam - 페이지 번호 (0부터 시작)
     * @param limitSize - 한 페이지에 표시할 항목 수
     * @returns 팔로워 목록 및 다음 페이지의 존재 여부를 반환합니다.
     */
    async getFollowersInfiniteScroll(following: string, search: string, pageParam: number, limitSize: number) {
        // const initials = this.getInitials(search);

        const initials = disassembleHangulToGroups(search)
            .flatMap((values) => values[0])
            .join('');

        const follow = await this.followRepository
            .find(
                {
                    following,
                    isCanceled: false,
                    initials: { $regex: new RegExp(initials, 'gi') },
                },
                { follower: 1, followerNickname: 1 },
            )
            .populate({
                path: 'follower',
                select: 'nickname imageId',
                populate: { path: 'imageId', model: 'Image', select: 'imageKey -_id' },
            })
            .skip(pageParam * limitSize)
            .limit(limitSize)
            .exec();

        const items = await Promise.all(
            follow.map(async (entity) => {
                const userInfo = await this.getUserInfo({ user: entity.follower });

                return { user: { ...userInfo } };
            }),
        );

        const isLastPage = follow.length < limitSize;
        const nextPage = isLastPage ? undefined : pageParam + 1;

        return { items, nextPage };
    }

    /**
     * 사용자의 프로필 정보를 검색합니다.
     *
     * @param nickname - 프로필을 검색할 닉네임
     * @param user - 요청하는 사용자 정보 (선택 사항)
     * @returns 사용자 프로필 정보를 반환합니다.
     */
    async getProfile(nickname: string, user?: IUserProfileDTO) {
        const userInfo = await this.getUserInfo({ nickname, currentUserId: user?.id });
        const followCount = await this.getFollowCount(userInfo?.id);
        const isMine = user?.nickname === nickname;

        return {
            user: {
                ...userInfo,
                isMine,
                followerCount: followCount.follower,
                followingCount: followCount.following,
            },
        };
    }

    /**
     * 사용자 자신의 정보를 검색합니다.
     *
     * @param user - 요청하는 사용자 정보
     * @returns 사용자 프로필 정보를 반환합니다.
     */
    async getMyProfile(user: IUserProfileDTO) {
        const followCount = await this.getFollowCount(user.id);

        return {
            user: {
                ...user,
                followerCount: followCount.follower,
                followingCount: followCount.following,
            },
        };
    }

    /**
     * 사용자의 팔로워 목록을 페이지별로 무한 스크롤을 통해 검색합니다.
     *
     * @param userId - 현재 사용자의 ID
     * @param targetUserId - 팔로워 목록을 검색할 대상 사용자 ID
     * @param pageParam - 페이지 번호 (0부터 시작)
     * @param limitSize - 한 페이지에 표시할 항목 수
     * @returns 팔로워 목록 및 다음 페이지의 존재 여부를 반환합니다.
     */
    async getUserFollowersInfiniteScroll(userId: string, targetUserId: string, pageParam: number, limitSize: number) {
        try {
            const followers = await this.followRepository.getAggregatedFollowerList(userId, targetUserId, pageParam, limitSize);

            const items = await Promise.all(
                followers.map(async (entity) => {
                    const isMine = entity.isMine;
                    const currentUserId = isMine ? undefined : userId;
                    const isFollow = currentUserId ? await this.isExistsFollow(currentUserId, entity.following) : undefined;

                    return {
                        user: {
                            id: String(entity.following),
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

            const isLastPage = followers.length < limitSize;
            const nextPage = isLastPage ? undefined : pageParam + 1;

            return { items, nextPage };
        } catch (error) {
            throw new CustomExceptionHandler(error).handleException('Invalid ObjectId for user Id.', -1501);
        }
    }

    /**
     * 사용자의 팔로잉 목록을 페이지별로 무한 스크롤을 통해 검색합니다.
     *
     * @param userId - 현재 사용자의 ID
     * @param targetUserId - 팔로잉 목록을 검색할 대상 사용자 ID
     * @param pageParam - 페이지 번호 (0부터 시작)
     * @param limitSize - 한 페이지에 표시할 항목 수
     * @returns 팔로잉 목록 및 다음 페이지의 존재 여부를 반환합니다.
     */
    async getUserFollowingsInfiniteScroll(userId: string, targetUserId: string, pageParam: number, limitSize: number) {
        try {
            const followings = await this.followRepository.getAggregatedFollowingList(
                userId,
                targetUserId,
                pageParam,
                limitSize,
            );

            const items = await Promise.all(
                followings.map(async (entity) => {
                    const isMine = entity.isMine;
                    const currentUserId = isMine ? undefined : userId;
                    const isFollow = currentUserId ? await this.isExistsFollow(currentUserId, entity.follower) : undefined;

                    return {
                        user: {
                            id: String(entity.follower),
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

            const isLastPage = followings.length < limitSize;
            const nextPage = isLastPage ? undefined : pageParam + 1;

            return { items, nextPage };
        } catch (error) {
            throw new CustomExceptionHandler(error).handleException('Invalid ObjectId for user Id.', -1501);
        }
    }

    /**
     *    여러 곳에서 공유되는 함수들 모음
     *
     *
     */

    /**
     * 사용자 정보를 검색합니다.
     *
     * @param option - 사용자 정보를 검색하는 데 필요한 옵션
     * @returns 사용자 정보를 반환합니다.
     */
    async getUserInfo(option: UserOption) {
        const { targetUserId, nickname, currentUserId, user } = option;
        let userInfo;

        if (user) {
            userInfo = Object(user).Mapper();
        } else {
            const findUser = nickname
                ? await this.userRepository.findOne({ nickname }).populate({ path: 'imageId', select: 'imageKey -_id' }).exec()
                : await this.userRepository
                      .findOne({ _id: targetUserId })
                      .populate({ path: 'imageId', select: 'imageKey -_id' })
                      .exec();

            if (!findUser) {
                throw new CustomException('Not found for the specified user Info.', HttpStatus.NOT_FOUND, -1304);
            }

            userInfo = findUser.Mapper();
        }

        const isFollow = currentUserId ? await this.isExistsFollow(currentUserId, userInfo.id) : undefined;
        const fcmToken = targetUserId ? userInfo.fcmToken : undefined;

        return {
            id: userInfo.id,
            nickname: userInfo.nickname,
            profile: {
                src: `${process.env.AWS_IMAGE_BASEURL}${userInfo.imageId.imageKey}`,
            },
            isFollow,
            fcmToken,
        };
    }

    /**
     * 팔로우 상태를 검색합니다.
     *
     * @param following - 팔로우 대상 사용자 ID
     * @param follower - 팔로우 요청자 사용자 ID
     * @returns 팔로우 상태를 반환합니다.
     */
    async getFollowStatus(following: string, follower: string) {
        try {
            const follow = await this.followRepository.findOne({ following, follower }).exec();

            if (!follow) {
                throw new CustomException('Not found for the specified Follow status.', HttpStatus.NOT_FOUND, -1303);
            }

            return follow.Mapper();
        } catch (error) {
            throw new CustomExceptionHandler(error).handleException('Invalid ObjectId for user Id.', -1502);
        }
    }

    /**
     * 닉네임 중복 여부를 검색합니다.
     *
     * @param nickname - 검색할 닉네임
     * @returns 중복 여부 정보를 반환합니다.
     */
    async isDuplicateNickname(nickname: string): Promise<{ isDuplicate: boolean }> {
        const user = await this.userRepository.findOne({ nickname }).exec();

        return { isDuplicate: user ? true : false };
    }

    /**
     * 사용자 ID를 검색합니다.
     *
     * @param _id - 사용자 ID
     * @returns 사용자 정보를 반환합니다.
     */
    async findUserId(_id: string) {
        try {
            const user = await this.userRepository.findOne({ _id }).exec();

            if (!user) {
                throw new CustomException('Not found for the specified user Id.', HttpStatus.NOT_FOUND, -1301);
            }

            return user.Mapper();
        } catch (error) {
            throw new CustomExceptionHandler(error).handleException('Invalid ObjectId for user Id.', -1501);
        }
    }

    /**
     * 닉네임을 검색합니다.
     *
     * @param nickname - 검색할 닉네임
     * @returns 사용자 정보를 반환합니다.
     */
    async findNickname(nickname: string) {
        const user = await this.userRepository.findOne({ nickname }).exec();

        if (!user) {
            throw new CustomException('Not found for the specified nickname.', HttpStatus.NOT_FOUND, -1302);
        }

        return user?.Mapper();
    }

    /**
     * 닉네임을 검색합니다.
     *
     * @param nickname - 검색할 닉네임
     * @returns 사용자 정보를 반환합니다.
     */
    async extractUserInfo(nicknames: string[]) {
        const users = await this.userRepository.find({ nickname: { $in: nicknames } }, { _id: 1, fcmToken: 1 }).exec();

        return users?.map((entity) => entity.Mapper());
    }

    /**
     * 팔로우 상태의 존재 여부를 검색합니다.
     *
     * @param following - 팔로우 대상 사용자 ID
     * @param follower - 팔로우 요청자 사용자 ID
     * @returns 팔로우 상태의 존재 여부를 반환합니다.
     */
    async isExistsFollow(following: string, follower: string) {
        const follow = await this.followRepository.findOne({ following, follower }).exec();
        return follow ? (follow.isCanceled ? false : true) : undefined;
    }

    /**
     * 사용자의 팔로워 및 팔로잉 수를 검색합니다.
     *
     * @param targetUserId - 대상 사용자 ID
     * @returns 팔로우 수 정보를 반환합니다.
     */
    async getFollowCount(targetUserId: string) {
        const [followerCount, followingCount] = await Promise.all([
            this.followRepository.countDocuments({ follower: targetUserId, isCanceled: false }).exec(),
            this.followRepository.countDocuments({ following: targetUserId, isCanceled: false }).exec(),
        ]);

        return { follower: followerCount, following: followingCount };
    }

    /**
     * 사용자의 팔로워 목록을 검색합니다.
     *
     * @param userId - 사용자 ID
     * @returns 팔로워 목록을 반환합니다.
     */
    async getUserFollowers(userId: string) {
        const followers = await this.followRepository.find({ following: userId, isCanceled: false }, { follower: 1 }).exec();
        return followers.map((entity) => entity.Mapper().follower as string);
    }

    /**
     * 이용 가능한 닉네임을 생성합니다.
     *
     * @returns 생성된 닉네임을 반환합니다.
     */
    async generateAvailableNickname() {
        for (let i = 0; i < 15; i++) {
            const baseNickname = this.generateRandomNickname();
            const nicknameToCheck = i < 5 ? baseNickname : `${baseNickname}${i - 5}`;

            const isDuplicate = await this.isDuplicateNickname(nicknameToCheck);
            if (!isDuplicate.isDuplicate) {
                return nicknameToCheck;
            }
        }

        throw new CustomException('Too many requests to generate a nickname.', HttpStatus.UNPROCESSABLE_ENTITY, -1502);
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
