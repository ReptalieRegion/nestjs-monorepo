import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { serviceErrorHandler } from '../../../utils/error/errorHandler';
import { FollowRepository } from '../repository/follow.repository';
import { UserSearcherService, UserSearcherServiceToken } from './userSearcher.service';

export const UserWriterServiceToken = 'UserWriterServiceToken';

@Injectable()
export class UserWriterService {
    constructor(
        private readonly followRepository: FollowRepository,

        @Inject(UserSearcherServiceToken)
        private readonly userSearcherService: UserSearcherService,
    ) {}

    async createFollow(following: string, follower: string) {
        if (following === follower) {
            throw new BadRequestException('Following and follower cannot be the same user.');
        }

        try {
            const followerInfo = await this.userSearcherService.isExistsId(follower);
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
}
