import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CustomException } from '../../../utils/error/customException';
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
        const result = await this.userRepository.updateOne({ _id: userId }, { $set: { fcmToken: 'defaultValue' } }).exec();

        if (result.modifiedCount === 0) {
            throw new CustomException('Failed to delete user fcmToken.', HttpStatus.INTERNAL_SERVER_ERROR, -1605);
        }

        return { message: 'Success' };
    }
}
