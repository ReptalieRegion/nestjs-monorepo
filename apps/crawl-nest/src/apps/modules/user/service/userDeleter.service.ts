import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserActivityType } from '@private-crawl/types';
import { ClientSession } from 'mongoose';
import { CustomException } from '../../../utils/error/customException';
import { UserActivityLogService, UserActivityLogServiceToken } from '../../user-activity-log/userActivityLog.service';
import { FollowRepository } from '../repository/follow.repository';
import { UserRepository } from '../repository/user.repository';

export const UserDeleterServiceToken = 'UserDeleterServiceToken';

@Injectable()
export class UserDeleterService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly followRepository: FollowRepository,
        @Inject(UserActivityLogServiceToken)
        private readonly userActivityLogService: UserActivityLogService,
    ) {}

    async fcmTokenDelete(userId: string) {
        const result = await this.userRepository.updateOne({ _id: userId }, { $set: { fcmToken: 'defaultValue' } }).exec();

        if (result.modifiedCount === 0) {
            throw new CustomException('Failed to delete user fcmToken.', HttpStatus.INTERNAL_SERVER_ERROR, -1605);
        }

        return { message: 'Success' };
    }
    async withdrawalUserInfo(_id: string, session: ClientSession) {
        const result = await this.userRepository.deleteOne({ _id }, { session }).exec();

        if (result.deletedCount === 0) {
            throw new CustomException('Failed to delete user', HttpStatus.INTERNAL_SERVER_ERROR, -1616);
        }

        this.userActivityLogService.createActivityLog({ userId: _id, activityType: UserActivityType.WITHDRAWAL });
    }

    async withdrawalFollowInfo(userId: string, session: ClientSession) {
        await this.followRepository
            .updateMany(
                {
                    $or: [
                        { following: userId, isCanceled: false },
                        { follower: userId, isCanceled: false },
                    ],
                },
                { $set: { isCanceled: true } },
                { session },
            )
            .exec();
    }
}
