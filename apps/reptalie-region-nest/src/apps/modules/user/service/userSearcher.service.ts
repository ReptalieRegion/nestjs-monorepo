import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../../schemas/user.schema';
import { serviceErrorHandler } from '../../../utils/error/errorHandler';
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

    async getProfile(currentUserId: string, nickname: string) {
        const userInfo = await this.getUserInfo({ nickname, currentUserId });
        const followCount = await this.getFollowCount(userInfo?.id);

        return {
            user: {
                ...userInfo,
                followerCount: followCount.follower,
                followingCount: followCount.following,
            },
        };
    }

    async getUserFollowersInfiniteScroll(userId: string, targetUserId: string, pageParam: number, limitSize: number) {
        try {
            const followers = await this.followRepository
                .find({ follower: targetUserId, isCanceled: false }, { following: 1 })
                .populate({
                    path: 'following',
                    select: 'nickname imageId',
                    populate: { path: 'imageId', model: 'Image', select: 'imageKey -_id' },
                })
                .skip(pageParam * limitSize)
                .limit(limitSize)
                .exec();

            const currentUserId = userId ? userId : undefined;

            const items = await Promise.all(
                followers.map(async (entity) => {
                    const userInfo = await this.getUserInfo({ user: entity.following, currentUserId });

                    return { user: { ...userInfo } };
                }),
            );

            const isLastPage = followers.length < limitSize;
            const nextPage = isLastPage ? undefined : pageParam + 1;

            return { items, nextPage };
        } catch (error) {
            serviceErrorHandler(error, 'Invalid ObjectId for user Id');
        }
    }

    async getUserFollowingsInfiniteScroll(userId: string, targetUserId: string, pageParam: number, limitSize: number) {
        try {
            const followings = await this.followRepository
                .find({ following: targetUserId, isCanceled: false }, { follower: 1 })
                .populate({
                    path: 'follower',
                    select: 'nickname imageId',
                    populate: { path: 'imageId', model: 'Image', select: 'imageKey -_id' },
                })
                .skip(pageParam * limitSize)
                .limit(limitSize)
                .exec();

            const currentUserId = userId ? userId : undefined;

            const items = await Promise.all(
                followings.map(async (entity) => {
                    const userInfo = await this.getUserInfo({ user: entity.follower, currentUserId });

                    return { user: { ...userInfo } };
                }),
            );

            const isLastPage = followings.length < limitSize;
            const nextPage = isLastPage ? undefined : pageParam + 1;

            return { items, nextPage };
        } catch (error) {
            serviceErrorHandler(error, 'Invalid ObjectId for user Id');
        }
    }

    /**
     *    여러 곳에서 공유되는 함수들 모음
     *
     *
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
                throw new NotFoundException('User does not exist');
            }

            userInfo = findUser.Mapper();
        }

        const isFollow = currentUserId ? await this.isExistsFollow(currentUserId, userInfo.id) : undefined;

        return {
            id: userInfo.id,
            nickname: userInfo.nickname,
            profile: {
                src: `${process.env.AWS_IMAGE_BASEURL}${userInfo.imageId.imageKey}`,
            },
            isFollow,
        };
    }

    async getFollowStatus(following: string, follower: string) {
        try {
            const follow = await this.followRepository.findOne({ following, follower }).exec();

            if (!follow) {
                throw new NotFoundException('Not found for the specified Follow status.');
            }

            return follow.Mapper();
        } catch (error) {
            serviceErrorHandler(error, 'Invalid ObjectId for follower.');
        }
    }

    async isExistsId(_id: string) {
        try {
            const user = await this.userRepository.findOne({ _id }).exec();

            if (!user) {
                throw new NotFoundException('Not found for the specified user Id.');
            }

            return user.Mapper();
        } catch (error) {
            serviceErrorHandler(error, 'Invalid ObjectId for user Id.');
        }
    }

    async isExistsEmail(email: string) {
        const user = await this.userRepository.findByEmail(email);
        return Boolean(user);
    }

    async isExistsNickname(nickname: string) {
        const user = await this.userRepository.findOne({ nickname }).exec();

        if (!user) {
            throw new NotFoundException('Not found for the specified nickname.');
        }

        return user.Mapper();
    }

    async isExistsFollow(following: string, follower: string) {
        const follow = await this.followRepository.findOne({ following, follower }).exec();
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
