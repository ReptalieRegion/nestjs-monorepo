import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { FollowRepository } from '../repository/follow.repository';
import { UserRepository } from '../repository/user.repository';
import { UserSearcherService, UserSearcherServiceToken } from './userSearcher.service';

export const UserDeleterServiceToken = 'UserDeleterServiceToken';

@Injectable()
export class UserDeleterService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly followRepository: FollowRepository,

        @Inject(UserSearcherServiceToken)
        private readonly userSearcherService: UserSearcherService,
    ) {}

    async fcmTokenDelete(userId: string) {
        const result = await this.userRepository.updateOne({ _id: userId }, { $set: { fcmToken: '' } }).exec();

        if (result.modifiedCount === 0) {
            throw new InternalServerErrorException('Failed to delete user fcmToken.');
        }

        return;
    }
}
