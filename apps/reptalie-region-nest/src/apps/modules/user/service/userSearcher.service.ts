import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { BSONError } from 'bson';
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
            if (error instanceof BSONError) {
                throw new UnprocessableEntityException('User Id Invalid ObjectId');
            }
            throw error;
        }
    }
    async isExistsTagsId(tagIds: string[]) {
        try {
            const user = await this.userRepository.findUserIdByTaggedId(tagIds);

            if (!user || tagIds.length !== user.length) {
                throw new NotFoundException('TagIds does not exist');
            }

            return user;
        } catch (error) {
            const typedError = error as Error;
            if (typedError instanceof BSONError || typedError.name === 'CastError') {
                throw new UnprocessableEntityException('TagIds Invalid ObjectId');
            }
            throw typedError;
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
