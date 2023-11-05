import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { FollowRepository } from '../repository/follow.repository';
import { UserRepository } from '../repository/user.repository';
import { UserSearcherService, UserSearcherServiceToken } from './userSearcher.service';

export const UserUpdaterServiceToken = 'UserUpdaterServiceToken';

@Injectable()
export class UserUpdaterService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly followRepository: FollowRepository,

        @Inject(UserSearcherServiceToken)
        private readonly userSearcherService: UserSearcherService,
    ) {}

    /**
     * 사용자의 이미지 ID를 업데이트합니다.
     *
     * @param _id - 사용자 ID
     * @param imageId - 새로운 이미지 ID
     * @param session - MongoDB 클라이언트 세션
     */
    async updateImageId(_id: string, imageId: string, session: ClientSession) {
        const result = await this.userRepository.updateOne({ _id }, { $set: { imageId } }, { session }).exec();

        if (result.modifiedCount === 0) {
            throw new InternalServerErrorException('Failed to update image Id.');
        }
    }

    /**
     * 사용자의 닉네임을 업데이트합니다.
     *
     * @param nickname - 새로운 닉네임
     * @param userId - 사용자 ID
     * @param session - MongoDB 클라이언트 세션
     */
    async updateNickname(nickname: string, userId: string, session: ClientSession) {
        const result = await this.userRepository.updateOne({ _id: userId }, { $set: { nickname } }, { session }).exec();

        if (result.modifiedCount === 0) {
            throw new InternalServerErrorException('Failed to update user nickname.');
        }
    }

    /**
     * 팔로우 상태를 토글합니다.
     *
     * @param following - 팔로우 대상 사용자 ID
     * @param follower - 팔로우를 요청한 사용자 ID
     * @returns 팔로우 상태를 업데이트한 결과를 반환합니다.
     */
    async toggleFollow(following: string, follower: string) {
        if (following === follower) {
            throw new BadRequestException('Following and follower cannot be the same user.');
        }

        const followStatus = await this.userSearcherService.getFollowStatus(following, follower);

        const result = await this.followRepository
            .updateOne({ _id: followStatus?.id }, { $set: { isCanceled: !followStatus?.isCanceled } })
            .exec();

        if (result.modifiedCount === 0) {
            throw new InternalServerErrorException('Failed to update follow status.');
        }

        return { user: { nickname: followStatus?.followerNickname } };
    }
}
