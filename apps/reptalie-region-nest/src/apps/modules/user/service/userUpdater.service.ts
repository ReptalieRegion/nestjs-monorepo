import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { FollowRepository } from '../repository/follow.repository';
import { UserRepository } from '../repository/user.repository';
import { UserSearcherService, UserSearcherServiceToken } from './userSearcher.service';

export const UserUpdaterServiceToken = 'UserUpdaterServiceToken';

@Injectable()
export class UserUpdaterService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly followeRepository: FollowRepository,

        @Inject(UserSearcherServiceToken)
        private readonly userSearcherService: UserSearcherService,
    ) {}

    async toggleFollow(following: string, follower: string) {
        const follow = await this.userSearcherService.getFollowInfo(following, follower);

        const result = await this.followeRepository.updateFollow(follow.id, follow.isCanceled);
        if (result === 0) {
            throw new InternalServerErrorException('Failed to toggle the Follow status.');
        }
    }
}
