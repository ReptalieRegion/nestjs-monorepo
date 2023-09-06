import { Injectable, NotFoundException } from '@nestjs/common';
import { handleBSONAndCastError } from '../../../utils/error/errorHandler';
import { UserRepository } from '../user.repository';

export const UserSearcherServiceToken = 'UserSearcherServiceToken';

@Injectable()
export class UserSearcherService {
    constructor(private readonly userRepository: UserRepository) {}

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

    async isExistsEmail(email: string) {
        const user = await this.userRepository.findByEmail(email);
        return Boolean(user);
    }

    async isExistsNickname(nickname: string) {
        const user = await this.userRepository.findByNickname(nickname);
        return Boolean(user);
    }
}
