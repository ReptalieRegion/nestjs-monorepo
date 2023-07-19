import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user.repository';

export const UserSearcherServiceToken = 'UserSearcherServiceToken';

@Injectable()
export class UserSearcherService {
    constructor(private readonly userRepository: UserRepository) {}

    async userIdExists(id: string) {
        return Boolean(await this.userRepository.findByUserId(id));
    }
}
