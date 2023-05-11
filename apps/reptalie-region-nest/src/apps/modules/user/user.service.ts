import { Injectable } from '@nestjs/common';

import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async isExistsEmail(email: string) {
        const user = await this.userRepository.findByEmail(email);

        if (user) {
            return true;
        }

        return false;
    }

    async isExistsNickname(nickname: string) {
        const user = await this.userRepository.findByNickname(nickname);

        if (user) {
            return true;
        }

        return false;
    }
}
