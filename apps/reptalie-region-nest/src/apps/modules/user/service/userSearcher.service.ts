import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { User } from '../../../schemas/user.schema';
import { handleBSONAndCastError } from '../../../utils/error/errorHandler';
import { ShareSearcherService, ShareSearcherServiceToken } from '../../share/service/shareSearcher.service';
import { FollowRepository } from '../repository/follow.repository';
import { UserRepository } from '../repository/user.repository';

export const UserSearcherServiceToken = 'UserSearcherServiceToken';

interface OperationOption {
    user: {
        targetUserId?: string;
        currentUserId?: string;
        nickname?: string;
        user?: User;
    };
}

@Injectable()
export class UserSearcherService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly followRepository: FollowRepository,

        @Inject(forwardRef(() => ShareSearcherServiceToken))
        private readonly shareSearcherService: ShareSearcherService,
    ) {}

    async getFollowersInfiniteScroll(following: string, search: string, pageParam: number, limitSize: number) {
        const follow = await this.followRepository
            .find(
                {
                    following,
                    isCanceled: false,
                    followerNickname: { $regex: new RegExp(`^${search}`, 'i') },
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

        const items = follow.map((entity) => {
            const followerInfo = Object(entity.Mapper().follower).Mapper();

            return {
                id: followerInfo?.id,
                nickname: followerInfo?.nickname,
                profile: {
                    src: `${process.env.AWS_IMAGE_BASEURL}${Object(followerInfo?.imageId).imageKey}`,
                },
            };
        });

        const isLastPage = follow.length < limitSize;
        const nextPage = isLastPage ? undefined : pageParam + 1;

        return { items, nextPage };
    }

    async getProfile(currentUserId: string, nickname: string) {
        const userInfo = await this.getUserInfo({ user: { nickname, currentUserId } });
        const followCount = await this.getFollowCount(userInfo?.id);

        return {
            user: {
                ...userInfo,
                followerCount: followCount.follower,
                followingCount: followCount.following,
            },
        };
    }

    /**
     *    여러 곳에서 공유되는 함수들 모음
     *
     *
     */

    async getUserInfo(option: OperationOption) {
        let userInfo, isFollow;

        if (option.user.user) {
            userInfo = Object(option.user.user).Mapper();
        } else {
            const { targetUserId, nickname, currentUserId } = option.user;

            userInfo = nickname
                ? await this.userRepository
                      .findOne({ nickname }, { nickname: 1, imageId: 1 })
                      .populate({ path: 'imageId', select: 'imageKey -_id' })
                      .exec()
                : await this.userRepository
                      .findOne({ _id: targetUserId }, { nickname: 1, imageId: 1 })
                      .populate({ path: 'imageId', select: 'imageKey -_id' })
                      .exec();

            if (!userInfo) {
                throw new NotFoundException('User does not exist');
            }
            isFollow = currentUserId ? await this.isExistsFollow(currentUserId, userInfo.id) : undefined;
        }

        return {
            id: userInfo.id,
            nickname: userInfo.nickname,
            profile: {
                src: `${process.env.AWS_IMAGE_BASEURL}${Object(userInfo.imageId).imageKey}`,
            },
            isFollow,
        };
    }

    async getFollowInfo(following: string, follower: string) {
        try {
            const follow = await this.followRepository
                .findOne({ following, follower }, { followerNickname: 1, isCanceled: 1 })
                .exec();

            if (!follow) {
                throw new NotFoundException('Follow status not found for the specified following and follower.');
            }

            return follow.Mapper();
        } catch (error) {
            handleBSONAndCastError(error, 'follower Id Invalid ObjectId.');
        }
    }

    async isExistsEmail(email: string) {
        const user = await this.userRepository.findByEmail(email);
        return Boolean(user);
    }

    async isExistsNickname(nickname: string) {
        const user = await this.userRepository.findOne({ nickname }, { nickname: 1 }).exec();
        if (!user) {
            throw new NotFoundException('User Nickname does not exist');
        }

        return user.Mapper();
    }

    async isExistsUserId(userId: string) {
        try {
            const user = await this.userRepository.findOne({ _id: userId }, { _id: 1, nickname: 1 }).exec();

            if (!user) {
                throw new NotFoundException('User not found for the specified user id.');
            }

            return user.Mapper();
        } catch (error) {
            handleBSONAndCastError(error, 'user Id Invalid ObjectId.');
        }
    }

    async isExistsFollow(following: string, follower: string) {
        const follow = await this.followRepository.findOne({ following, follower }, { isCanceled: 1 }).exec();
        return follow ? (follow.isCanceled ? false : true) : undefined;
    }

    async getFollowCount(targetUserId: string) {
        const [followerCount, followingCount] = await Promise.all([
            this.followRepository.countDocuments({ follower: targetUserId, isCanceled: false }).exec(),
            this.followRepository.countDocuments({ following: targetUserId, isCanceled: false }).exec(),
        ]);

        return { follower: followerCount, following: followingCount };
    }

    async getUserFollowers(userId: string) {
        const followers = await this.followRepository.find({ following: userId, isCanceled: false }, { follower: 1 }).exec();
        return followers.map((entity) => entity.Mapper().follower as string);
    }
}
