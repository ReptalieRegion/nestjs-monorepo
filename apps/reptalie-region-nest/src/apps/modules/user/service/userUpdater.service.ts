import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { FollowRepository } from '../repository/follow.repository';
import { UserRepository } from '../repository/user.repository';
import { UserSearcherService, UserSearcherServiceToken } from './userSearcher.service';

export const UserUpdaterServiceToken = 'UserUpdaterServiceToken';

@Injectable()
export class UserUpdaterService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly followRepository: FollowRepository,

        @Inject(UserSearcherServiceToken)
        private readonly userSearcherService: UserSearcherService,
    ) {}

    async updateUserImageId(_id: string, imageId: string) {
        const result = await this.userRepository.updateOne({ _id }, { $set: { imageId } }).exec();

        if (result.modifiedCount === 0) {
            throw new InternalServerErrorException('Failed to update image Id.');
        }
    }

    async toggleFollow(following: string, follower: string) {
        if (following === follower) {
            throw new BadRequestException('Following and follower cannot be the same user.');
        }

        const followStatus = await this.userSearcherService.getFollowStatus(following, follower);

        const result = await this.followRepository
            .updateOne({ _id: followStatus?.id }, { $set: { isCanceled: !followStatus?.isCanceled } })
            .exec();

        if (result.modifiedCount === 0) {
            throw new InternalServerErrorException('Failed to update follow status.');
        }

        return { user: { nickname: followStatus?.followerNickname } };
    }
}
