import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import mongoose, { ClientSession } from 'mongoose';
import { ImageType } from '../../../dto/image/input-image.dto';
import { InputUserDTO } from '../../../dto/user/user/input-user.dto';
import { serviceErrorHandler } from '../../../utils/error/errorHandler';
import { ImageWriterService, ImageWriterServiceToken } from '../../image/service/imageWriter.service';
import { FollowRepository } from '../repository/follow.repository';
import { UserRepository } from '../repository/user.repository';
import { UserSearcherService, UserSearcherServiceToken } from './userSearcher.service';
import { UserUpdaterService, UserUpdaterServiceToken } from './userUpdater.service';

export const UserWriterServiceToken = 'UserWriterServiceToken';

@Injectable()
export class UserWriterService {
    constructor(
        private readonly followRepository: FollowRepository,
        private readonly userRepository: UserRepository,

        @Inject(UserSearcherServiceToken)
        private readonly userSearcherService: UserSearcherService,
        @Inject(UserUpdaterServiceToken)
        private readonly userUpdaterService: UserUpdaterService,
        @Inject(ImageWriterServiceToken)
        private readonly imageWriterService: ImageWriterService,
    ) {}

    async createUser(session: ClientSession) {
        const dto: InputUserDTO = { imageId: String(new mongoose.Types.ObjectId()) };

        const user = await this.userRepository.createUser(dto, session);
        console.log(user);
        
        const imageKeys = ['3d16d2c1-d2c4-4b8b-a496-3ef1c9ef45d6.png'];
        const image = await this.imageWriterService.createImage(user.id as string, imageKeys, ImageType.Profile, session);
        await this.userUpdaterService.updateUserImageId(user.id as string, image[0].id as string, session);

        return user;
    }

    async createFollow(following: string, follower: string) {
        if (following === follower) {
            throw new BadRequestException('Following and follower cannot be the same user.');
        }

        try {
            const followerInfo = await this.userSearcherService.findUserId(follower);
            const followerNickname = followerInfo?.nickname as string;

            const follow = await this.followRepository.createFollow({ following, follower, followerNickname });

            if (!follow) {
                throw new InternalServerErrorException('Failed to save follow.');
            }

            return { user: { nickname: follow.followerNickname } };
        } catch (error) {
            serviceErrorHandler(error, 'following and follower should be unique values.');
        }
    }
}
