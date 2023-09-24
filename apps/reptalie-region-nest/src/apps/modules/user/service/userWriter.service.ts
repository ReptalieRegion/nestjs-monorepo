import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { FollowRepository } from '../repository/follow.repository';
import { UserSearcherService, UserSearcherServiceToken } from './userSearcher.service';

export const UserWriterServiceToken = 'UserWriterServiceToken';

@Injectable()
export class UserWriterService {
    constructor(
        private readonly followeRepository: FollowRepository,

        @Inject(UserSearcherServiceToken)
        private readonly userSearcherService: UserSearcherService,
    ) {}

    async createFollow(userId: string, follower: string) {
        const followerInfo = await this.userSearcherService.isExistsUserId(follower);

        const follow = await this.followeRepository.createFollow({
            following: userId,
            follower: followerInfo?.id,
            followerNickname: followerInfo?.nickname,
        });

        if (!follow) {
            throw new InternalServerErrorException('Failed to save follow.');
        }

        return { user: { nickname: follow.followerNickname } };
    }
}
