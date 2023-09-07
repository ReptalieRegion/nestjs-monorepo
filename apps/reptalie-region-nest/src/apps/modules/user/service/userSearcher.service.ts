import { Injectable, NotFoundException } from '@nestjs/common';
import { handleBSONAndCastError } from '../../../utils/error/errorHandler';
import { FollowRepository } from '../repository/follow.repository';
import { UserRepository } from '../repository/user.repository';

export const UserSearcherServiceToken = 'UserSearcherServiceToken';

@Injectable()
export class UserSearcherService {
    constructor(private readonly userRepository: UserRepository, private readonly followRepository: FollowRepository) {}

    async isExistsUserId(id: string) {
        try {
            const user = await this.userRepository.findUserIdById(id);

            if (!user) {
                throw new NotFoundException('User ID does not exist');
            }

            return user;
        } catch (error) {
            handleBSONAndCastError(error, 'UserId Invalid ObjectId');
        }
    }

    async isExistsUserIdWithNickName(id: string) {
        try {
            const user = await this.userRepository.findUserIdWithNickNameById(id);

            if (!user) {
                throw new NotFoundException('User ID does not exist');
            }

            return user;
        } catch (error) {
            handleBSONAndCastError(error, 'UserId Invalid ObjectId');
        }
    }

    async isExistsEmail(email: string) {
        const user = await this.userRepository.findByEmail(email);
        return Boolean(user);
    }

    async isExistsNickname(nickname: string) {
        const user = await this.userRepository.findByNickname(nickname);
        return Boolean(user);
    }

    async getFollowStatus(following: string, follower: string) {
        await this.isExistsUserId(follower);

        const follow = await this.followRepository.findFollowingWithFollowerByIsCancled(following, follower);

        if (!follow || !follow?.id || follow?.isCancled === undefined) {
            throw new NotFoundException('Follow status not found for the specified following and follower.');
        }

        return { id: follow.id, isCancled: follow.isCancled };
    }
}
