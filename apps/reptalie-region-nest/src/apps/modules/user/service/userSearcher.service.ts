import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { handleBSONAndCastError } from '../../../utils/error/errorHandler';
import { ImageSearcherService, ImageSearcherServiceToken } from '../../image/service/imageSearcher.service';
import { ShareSearcherService, ShareSearcherServiceToken } from '../../share/service/shareSearcher.service';
import { FollowRepository } from '../repository/follow.repository';
import { UserRepository } from '../repository/user.repository';

export const UserSearcherServiceToken = 'UserSearcherServiceToken';

@Injectable()
export class UserSearcherService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly followRepository: FollowRepository,

        @Inject(ShareSearcherServiceToken)
        private readonly shareSearcherService: ShareSearcherService,
        @Inject(ImageSearcherServiceToken)
        private readonly imageSearcherService: ImageSearcherService,
    ) {}

    async isExistsEmail(email: string) {
        const user = await this.userRepository.findByEmail(email);
        return Boolean(user);
    }

    async isExistsNickname(nickname: string) {
        const user = await this.userRepository.findByNickname(nickname);
        if (!user) {
            throw new NotFoundException('User Nickname does not exist');
        }

        return user;
    }

    async isExistsUserId(id: string) {
        try {
            const user = await this.userRepository.findByUserId(id);

            if (!user) {
                throw new NotFoundException('User ID does not exist');
            }

            return user;
        } catch (error) {
            handleBSONAndCastError(error, 'UserId Invalid ObjectId');
        }
    }

    async isExistsFollow(currentUserId: string, targetUserId: string) {
        const follow = await this.followRepository.findFollowRelationship(currentUserId, targetUserId);
        return follow ? (follow.isCanceled ? false : true) : false;
    }

    async getFollowInfo(following: string, follower: string) {
        await this.isExistsUserId(follower);

        const follow = await this.followRepository.findFollowByIsCanceled(following, follower);

        if (!follow || !follow?.id || follow?.isCanceled === undefined) {
            throw new NotFoundException('Follow status not found for the specified following and follower.');
        }

        return { id: follow.id, isCanceled: follow.isCanceled };
    }

    async getFollowCounts(targetUserId: string) {
        const [followerCount, followingCount] = await Promise.all([
            this.followRepository.countDocuments({ follower: targetUserId }).exec(),
            this.followRepository.countDocuments({ following: targetUserId }).exec(),
        ]);

        return { follower: followerCount, following: followingCount };
    }

    async getUserProfile(currentUserId: string, targetUserNickname: string) {
        const targetUserInfo = await this.isExistsNickname(targetUserNickname);

        if (!targetUserInfo.id) {
            throw new InternalServerErrorException('Could not find the target user.');
        }

        const followCounts = await this.getFollowCounts(targetUserInfo.id);
        const isFollow = currentUserId ? await this.isExistsFollow(currentUserId, targetUserInfo.id) : undefined;
        const profile = await this.imageSearcherService.getUserProfileImage(targetUserInfo.id);
        const postCount = await this.shareSearcherService.getUserPostCount(targetUserInfo.id);

        return {
            user: {
                id: targetUserInfo.id,
                nickname: targetUserNickname,
                followerCount: followCounts.follower,
                followingCount: followCounts.following,
                profile: profile,
                isFollow: isFollow,
            },
            post: {
                count: postCount,
            },
        };
    }
}
