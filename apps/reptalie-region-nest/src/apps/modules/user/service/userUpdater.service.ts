import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { ClientSession } from 'mongoose';
import { ImageType } from '../../../dto/image/input-image.dto';
import { fcmTokenDTO } from '../../../dto/user/user/fcm-token.dto';
import { IUserProfileDTO } from '../../../dto/user/user/response-user.dto';
import { CustomException } from '../../../utils/error/customException';
import { CustomExceptionHandler } from '../../../utils/error/customException.handler';
import { ImageDeleterService, ImageDeleterServiceToken } from '../../image/service/imageDeleter.service';
import { ImageS3HandlerService, ImageS3HandlerServiceToken } from '../../image/service/imageS3Handler.service';
import { ImageWriterService, ImageWriterServiceToken } from '../../image/service/imageWriter.service';
import { FollowRepository } from '../repository/follow.repository';
import { UserRepository } from '../repository/user.repository';
import { UserSearcherService, UserSearcherServiceToken } from './userSearcher.service';

export const UserUpdaterServiceToken = 'UserUpdaterServiceToken';

@Injectable()
export class UserUpdaterService {
    constructor(
        @InjectConnection()
        private readonly connection: mongoose.Connection,

        private readonly userRepository: UserRepository,
        private readonly followRepository: FollowRepository,

        @Inject(UserSearcherServiceToken)
        private readonly userSearcherService: UserSearcherService,
        @Inject(ImageS3HandlerServiceToken)
        private readonly imageS3HandlerService: ImageS3HandlerService,
        @Inject(ImageWriterServiceToken)
        private readonly imageWriterService: ImageWriterService,
        @Inject(ImageDeleterServiceToken)
        private readonly imageDeleterService: ImageDeleterService,
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
            throw new CustomException('Failed to update user imageId.', HttpStatus.INTERNAL_SERVER_ERROR, -1606);
        }
    }

    /**
     * 사용자의 닉네임을 업데이트합니다.
     *
     * @param nickname - 새로운 닉네임
     * @param userId - 사용자 ID
     * @param session - MongoDB 클라이언트 세션
     */
    async updateNickname(nickname: string, initials: string, userId: string, session: ClientSession) {
        try {
            const result = await this.userRepository
                .updateOne({ _id: userId }, { $set: { nickname, initials } }, { session })
                .exec();

            if (result.modifiedCount === 0) {
                throw new CustomException('Failed to update user nickname.', HttpStatus.INTERNAL_SERVER_ERROR, -1613);
            }
        } catch (error) {
            throw new CustomExceptionHandler(error).handleException('Invalid ObjectId for user Id.', -1501);
        }
    }

    /**
     * 사용자의 FCM( Firebase Cloud Messaging) 토큰을 업데이트하는 메서드입니다.
     *
     * @param user - 업데이트할 사용자의 정보를 포함한 객체
     * @param dto - 새로운 FCM 토큰 정보를 포함한 DTO
     * @returns 업데이트 작업의 결과를 나타내는 객체를 반환합니다.
     */
    async updateFcmToken(user: IUserProfileDTO, dto: fcmTokenDTO) {
        const result = await this.userRepository.updateOne({ _id: user.id }, { $set: { fcmToken: dto.fcmToken } }).exec();

        if (result.modifiedCount === 0) {
            throw new CustomException('Failed to update user fcmToken.', HttpStatus.INTERNAL_SERVER_ERROR, -1604);
        }

        return { message: 'Success' };
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
            throw new CustomException('following and follower cannot be the same user.', HttpStatus.BAD_REQUEST, -1001);
        }

        const followStatus = await this.userSearcherService.getFollowStatus(following, follower);

        const result = await this.followRepository
            .updateOne({ _id: followStatus?.id }, { $set: { isCanceled: !followStatus?.isCanceled } })
            .exec();

        if (result.modifiedCount === 0) {
            throw new CustomException('Failed to update follow status.', HttpStatus.INTERNAL_SERVER_ERROR, -1603);
        }

        return { user: { nickname: followStatus?.followerNickname } };
    }

    /**
     * 사용자 프로필 이미지를 업데이트합니다.
     *
     * @param user {IUserProfileDTO} - 업데이트할 사용자 정보
     * @param files {Express.Multer.File[]} - 업로드된 이미지 파일 배열
     * @returns - 업데이트된 프로필 이미지 정보를 반환합니다.
     */
    async updateMyProfileImage(user: IUserProfileDTO, files: Express.Multer.File[]) {
        const session: ClientSession = await this.connection.startSession();
        session.startTransaction();

        let imageKeys: string[] = [];

        try {
            await this.imageDeleterService.deleteImageByTypeId(ImageType.Profile, [user.id], session);
            imageKeys = await this.imageS3HandlerService.uploadToS3(files);
            const [image] = await this.imageWriterService.createImage(user.id, imageKeys, ImageType.Profile, session);
            await this.updateImageId(user.id, image.id as string, session);

            await session.commitTransaction();

            return { profile: { src: `${process.env.AWS_IMAGE_BASEURL}${image.imageKey}` } };
        } catch (error) {
            await this.imageS3HandlerService.deleteImagesFromS3(imageKeys);
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
    }
}
