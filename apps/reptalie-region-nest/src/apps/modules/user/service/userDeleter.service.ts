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

    async deleteUser(userId: string) {
        console.log(userId);
        
        // user 정보와 social 정보를 tempUser로 이관작업을 먼저진행한다.

        // 일상공유에 등록 정보들이 있는지 체크하고 삭제처리를 한다, 관련 이미지도 같이삭제

        // 다이어리 등록 정보들이 있는지 체크하고 삭제처리를 한다, 관련 이미지도 같이삭제

        // 이미지(프로필) 등록 정보를 확인하고 삭제처리를 한다.

        // 알림의 등록 정보가 있는지 체크하고 삭제한다.

        // 신고에 등록 정보가 있는지 체크하고 삭제한다.

    };
}
