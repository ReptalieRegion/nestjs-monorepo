import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InputFollowDTO } from '../../../dto/follow/input-follow.dto';
import { FollowRepository } from '../repository/follow.repository';
import { UserRepository } from '../repository/user.repository';
import { UserSearcherService, UserSearcherServiceToken } from './userSearcher.service';

export const UserWriterServiceToken = 'UserWriterServiceToken';

@Injectable()
export class UserWriterService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly followeRepository: FollowRepository,

        @Inject(UserSearcherServiceToken)
        private readonly userSearcherService: UserSearcherService,
    ) {}

    async createFollow(userId: string, follower: string) {
        const followerInfo = await this.userSearcherService.isExistsUserIdWithNickName(follower);

        const inputFollowDTO: InputFollowDTO = {
            following: userId,
            follower: followerInfo?.id,
            followerNickname: followerInfo?.nickname,
        };

        const follow = await this.followeRepository.createFollow(inputFollowDTO);

        if (!follow) {
            throw new InternalServerErrorException('Failed to create Follow');
        }
    }
}
