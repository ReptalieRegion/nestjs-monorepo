import { HttpStatus, Injectable } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { CustomException } from '../../../utils/error/customException';
import { FollowRepository } from '../repository/follow.repository';
import { UserRepository } from '../repository/user.repository';

export const UserDeleterServiceToken = 'UserDeleterServiceToken';

@Injectable()
export class UserDeleterService {
    constructor(private readonly userRepository: UserRepository, private readonly followRepository: FollowRepository) {}

    async fcmTokenDelete(userId: string) {
        const result = await this.userRepository.updateOne({ _id: userId }, { $set: { fcmToken: 'defaultValue' } }).exec();

        if (result.modifiedCount === 0) {
            throw new CustomException('Failed to delete user fcmToken.', HttpStatus.INTERNAL_SERVER_ERROR, -1605);
        }

        return { message: 'Success' };
    }

    async withdrawalFollowInfo(userId: string, session: ClientSession) {
        await this.followRepository
            .updateMany({ $or: [{ following: userId }, { follower: userId }] }, { $set: { isCanceled: true } }, { session })
            .exec();
    }
}
