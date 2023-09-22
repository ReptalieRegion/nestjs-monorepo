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

    async getUserFollowersInfiniteScroll(following: string, search: string, pageParam: number, limitSize: number) {
        const followers = await this.followRepository
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

        const items = followers.map((entity) => {
            const followerInfo = entity.follower.Mapper();

            return {
                id: followerInfo.id,
                nickname: followerInfo.nickname,
                profile: {
                    src: `${process.env.AWS_IMAGE_BASEURL}${Object(followerInfo.imageId).imageKey}`,
                },
            };
        });

        const isLastPage = followers.length < limitSize;
        const nextPage = isLastPage ? undefined : pageParam + 1;

        return { items, nextPage };
    }

    async getProfile(currentUserId: string, nickname: string) {
        const userInfo = await this.getUserInfo({ user: { nickname, currentUserId } });
        const followCount = await this.getFollowCount(userInfo?.id);
        const postCount = await this.shareSearcherService.getPostCount(userInfo?.id);

        return {
            user: {
                ...userInfo,
                followerCount: followCount.follower,
                followingCount: followCount.following,
            },
            post: {
                count: postCount,
            },
        };
    }

    /**
     *    여러 곳에서 공유되는 함수들 모음
     *
     *
     */

    async getUserInfo(option: OperationOption) {
        if (option.user.user) {
            const userInfo = option.user.user.Mapper();

            return {
                id: userInfo.id,
                nickname: userInfo.nickname,
                profile: {
                    src: `${process.env.AWS_IMAGE_BASEURL}${Object(userInfo.imageId).imageKey}`,
                },
            };
        }

        const _id = option.user.targetUserId;
        const nickname = option.user.nickname;
        const currentUserId = option.user.currentUserId;

        const userInfo = nickname
            ? await this.userRepository
                  .findOne({ nickname }, { _id: 1, nickname: 1, imageId: 1 })
                  .populate({ path: 'imageId', select: 'imageKey -_id' })
                  .exec()
            : await this.userRepository
                  .findOne({ _id }, { _id: 1, nickname: 1, imageId: 1 })
                  .populate({ path: 'imageId', select: 'imageKey -_id' })
                  .exec();

        if (!userInfo) {
            throw new NotFoundException('User does not exist');
        }

        return {
            id: userInfo.id,
            nickname: userInfo.nickname,
            profile: {
                src: `${process.env.AWS_IMAGE_BASEURL}${Object(userInfo.imageId).imageKey}`,
            },
            isFollow: currentUserId ? await this.isExistsFollow(currentUserId, userInfo.id) : undefined,
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
            handleBSONAndCastError(error, 'follower Id Invalid ObjectId');
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
                throw new NotFoundException('User Id does not exist');
            }

            return user.Mapper();
        } catch (error) {
            handleBSONAndCastError(error, 'User Id Invalid ObjectId');
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
