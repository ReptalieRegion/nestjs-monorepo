import { fakerKO } from '@faker-js/faker';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { OAuth2Client } from 'google-auth-library';
import mongoose, { ClientSession } from 'mongoose';
import { ImageType } from '../../../dto/image/input-image.dto';
import { IEncryptedDataDTO, JoinProgressType, SocialProvierType } from '../../../dto/user/social/input-social.dto';
import { IRestoreRequestDTO, InputTempUserDTO } from '../../../dto/user/tempUser/input-tempUser.dto';
import { IResponseTempUserDTO } from '../../../dto/user/tempUser/response-tempUser.dto';
import { Social } from '../../../schemas/social.schema';
import { CustomException } from '../../../utils/error/customException';
import { CustomExceptionHandler } from '../../../utils/error/customException.handler';
import { DiaryDeleterService, DiaryDeleterServiceToken } from '../../diary/service/diaryDeleter.service';
import { DiaryUpdaterService, DiaryUpdaterServiceToken } from '../../diary/service/diaryUpdater.service';
import { ImageDeleterService, ImageDeleterServiceToken } from '../../image/service/imageDeleter.service';
import { NotificationAgreeService, NotificationAgreeServiceToken } from '../../notification/service/notificationAgree.service';
import { NotificationLogService, NotificationLogServiceToken } from '../../notification/service/notificationLog.service';
import { ReportDeleterService, ReportDeleterServiceToken } from '../../report/service/reportDeleter.service';
import { ShareDeleterService, ShareDeleterServiceToken } from '../../share/service/shareDeleter.service';
import { ShareUpdaterService, ShareUpdaterServiceToken } from '../../share/service/shareUpdater.service';
import { UserDeleterService, UserDeleterServiceToken } from '../../user/service/userDeleter.service';
import { UserUpdaterService, UserUpdaterServiceToken } from '../../user/service/userUpdater.service';
import { UserWriterService, UserWriterServiceToken } from '../../user/service/userWriter.service';
import { SocialRepository } from '../repository/social.repository';
import { TempUserRepository } from '../repository/tempUser.repository';
import { AuthCommonService, AuthCommonServiceToken } from './authCommon.service';
import { AuthEncryptService, AuthEncryptServiceToken } from './authEncrypt.service';

export const AuthSocialServiceToken = 'AuthSocialServiceToken';

@Injectable()
export class AuthSocialService {
    constructor(
        @InjectConnection()
        private readonly connection: mongoose.Connection,

        private readonly socialRepository: SocialRepository,
        private readonly tempUserRepository: TempUserRepository,

        @Inject(AuthEncryptServiceToken)
        private readonly authEncryptService: AuthEncryptService,
        @Inject(AuthCommonServiceToken)
        private readonly authCommonService: AuthCommonService,
        @Inject(UserWriterServiceToken)
        private readonly userWriterService: UserWriterService,

        @Inject(ShareDeleterServiceToken)
        private readonly shareDeleterService: ShareDeleterService,
        @Inject(DiaryDeleterServiceToken)
        private readonly diaryDeleterService: DiaryDeleterService,
        @Inject(ImageDeleterServiceToken)
        private readonly imageDeleterService: ImageDeleterService,
        @Inject(UserDeleterServiceToken)
        private readonly userDeleterService: UserDeleterService,
        @Inject(NotificationAgreeServiceToken)
        private readonly notificationAgreeService: NotificationAgreeService,
        @Inject(ReportDeleterServiceToken)
        private readonly reportDeleterService: ReportDeleterService,
        @Inject(ShareUpdaterServiceToken)
        private readonly shareUpdaterService: ShareUpdaterService,
        @Inject(DiaryUpdaterServiceToken)
        private readonly diaryUpdaterService: DiaryUpdaterService,
        @Inject(UserUpdaterServiceToken)
        private readonly userUpdaterService: UserUpdaterService,
        @Inject(NotificationLogServiceToken)
        private readonly notificationLogService: NotificationLogService,
    ) {}

    /**
     * Kakao 로부터의 로그인 요청을 처리합니다.
     *
     * @param dto - 암호화된 데이터를 포함하는 데이터 전송 객체 (IEncryptedDataDTO).
     * @returns - Kakao 로그인에 대한 결과를 반환합니다. 이미 가입한 사용자의 경우 로그인 정보를 제공하고,
     *            새로운 사용자의 경우 회원가입 정보를 제공합니다.
     */
    async kakaoSignIn(dto: IEncryptedDataDTO) {
        const decryptedData = this.authEncryptService.decryptCrypto(dto.encryptedData);

        return this.socialSignIn(decryptedData, SocialProvierType.Kakao);
    }

    /**
     * Apple 로부터의 로그인 요청을 처리합니다.
     *
     * @param dto - 암호화된 데이터를 포함하는 데이터 전송 객체 (IEncryptedDataDTO).
     * @returns - Apple 로그인에 대한 결과를 반환합니다. 이미 가입한 사용자의 경우 로그인 정보를 제공하고,
     *            새로운 사용자의 경우 회원가입 정보를 제공합니다.
     */
    async appleSignIn(dto: IEncryptedDataDTO) {
        const decryptedData = this.authEncryptService.decryptCrypto(dto.encryptedData);

        return this.socialSignIn(decryptedData, SocialProvierType.Apple);
    }

    /**
     * Google 로부터의 로그인 요청을 처리합니다.
     *
     * @param dto - 암호화된 데이터를 포함하는 데이터 전송 객체 (IEncryptedDataDTO).
     * @returns - Google 로그인에 대한 결과를 반환합니다. 이미 가입한 사용자의 경우 로그인 정보를 제공하고,
     *            새로운 사용자의 경우 회원가입 정보를 제공합니다.
     */
    async googleSignIn(idToken: string) {
        const { GOOGLE_CLIENT_ID } = process.env;
        const client = new OAuth2Client(GOOGLE_CLIENT_ID);

        try {
            const ticket = await client.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID });
            const uniqueId = ticket.getPayload()?.sub;

            return this.socialSignIn(uniqueId as string, SocialProvierType.Google);
        } catch (error) {
            throw new CustomExceptionHandler(error).handleException('An error occurred while parsing the ID token.', -1611);
        }
    }

    async withdrawalRequest(userId: string) {
        const userInfo = await this.getSocialWithUserInfo(userId);

        const encryptIfPresent = (value?: string) => (value ? this.authEncryptService.encryptCrypto(value) : undefined);

        const name = encryptIfPresent(userInfo.userId.name);
        const phone = encryptIfPresent(userInfo.userId.phone);
        const address = encryptIfPresent(userInfo.userId.address);

        const dto: InputTempUserDTO = {
            userId: userInfo.userId.id as string,
            imageId: userInfo.userId.imageId as string,
            provider: userInfo.provider as SocialProvierType,
            uniqueId: userInfo.uniqueId as string,
            nickname: userInfo.userId.nickname as string,
            name,
            phone,
            address,
        };

        return this.withdrawalRequestDetail(userId, dto);
    }

    async restoreRequest(dto: IRestoreRequestDTO) {
        const { encryptedData, provider } = dto;
        let uniqueId;

        switch (provider) {
            case SocialProvierType.Kakao:
            case SocialProvierType.Apple:
                uniqueId = this.authEncryptService.decryptCrypto(encryptedData);
                break;
            case SocialProvierType.Google:
                try {
                    const { GOOGLE_CLIENT_ID } = process.env;
                    const client = new OAuth2Client(GOOGLE_CLIENT_ID);

                    const ticket = await client.verifyIdToken({ idToken: encryptedData, audience: GOOGLE_CLIENT_ID });
                    uniqueId = ticket.getPayload()?.sub;
                } catch (error) {
                    throw new CustomExceptionHandler(error).handleException(
                        'An error occurred while parsing the ID token.',
                        -1611,
                    );
                }
                break;
            default:
                throw new CustomException('Invalid data for the specified provider.', HttpStatus.UNPROCESSABLE_ENTITY, -1505);
        }

        const tempUser = await this.tempUserRepository.findOne({ uniqueId, provider }).exec();

        if (!tempUser) {
            throw new CustomException('Not found for the specified temp user.', HttpStatus.NOT_FOUND, -1306);
        }

        return this.restoreRequestDetail(tempUser.Mapper());
    }

    /**
     * mock 데이터 생성
     */
    async mockSocialSignUp(session: ClientSession) {
        const providers = [SocialProvierType.Apple, SocialProvierType.Google, SocialProvierType.Kakao];
        const user = await this.userWriterService.createUser(session);
        const randomIndex = Math.floor(Math.random() * providers.length);

        await this.socialRepository.createSocial(
            {
                userId: user.id as string,
                provider: providers[randomIndex],
                uniqueId: `mock_${fakerKO.string.uuid()}`,
                joinProgress: JoinProgressType.DONE,
            },
            session,
        );

        return user;
    }

    /**
     * 소셜 로그인 처리를 수행하고 결과를 반환합니다.
     *
     * @param uniqueId 사용자의 고유 식별자입니다.
     * @param provider 제공자 타입입니다.
     * @returns - 소셜 로그인 처리 결과를 나타내는 객체를 반환합니다.
     */
    private async socialSignIn(uniqueId: string, provider: SocialProvierType) {
        const session: ClientSession = await this.connection.startSession();
        session.startTransaction();

        try {
            const socialProfile = await this.socialRepository
                .findOne({ provider, uniqueId })
                .populate({ path: 'userId', select: 'nickname' })
                .exec();

            const result = socialProfile
                ? await this.processSocialProfile(socialProfile, session)
                : await this.socialSignUp(uniqueId, provider, session);

            await session.commitTransaction();

            return result;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
    }

    /**
     * joinProgress, 그 상태에 따라 적절한 응답을 생성합니다.
     *
     * @param socialProfile 처리할 소셜 프로필입니다.
     * @param session 트랜잭션 작업을 위한 데이터베이스 세션입니다.
     * @returns - 소셜 프로필을 처리한 결과를 나타내는 객체를 반환합니다.
     */
    private async processSocialProfile(socialProfile: Social, session: ClientSession) {
        const user = Object(socialProfile.userId).Mapper();

        if (socialProfile.joinProgress === JoinProgressType.DONE) {
            const token = await this.authCommonService.tokenGenerationAndStorage(user.id, session);

            return { type: 'SIGN_IN', accessToken: token.accessToken, refreshToken: token.refreshToken };
        } else {
            return { type: 'SIGN_UP', joinProgress: socialProfile.joinProgress, nickname: user.nickname, userId: user.id };
        }
    }

    /**
     * 소셜 로그인을 통해 새로운 사용자를 등록합니다.
     *
     * @param uniqueId - 소셜 고유 식별자.
     * @param provider - 소셜 제공자 타입.
     * @param session - 데이터베이스 세션.
     * @returns - 회원가입 정보를 포함하는 결과를 반환합니다.
     */
    private async socialSignUp(uniqueId: string, provider: SocialProvierType, session: ClientSession) {
        const tempUser = await this.tempUserRepository.findOne({ uniqueId, provider }).exec();

        if (tempUser) {
            throw new CustomException(
                'This is an ID that has been withdrawn by the user.',
                HttpStatus.EXPECTATION_FAILED,
                -1401,
            );
        }

        const user = await this.userWriterService.createUser(session);

        const social = await this.socialRepository.createSocial(
            { userId: user.id as string, provider, uniqueId, joinProgress: JoinProgressType.REGISTER0 },
            session,
        );

        if (!social) {
            throw new CustomException('Failed to save social.', HttpStatus.INTERNAL_SERVER_ERROR, -1610);
        }

        return { type: 'SIGN_UP', joinProgress: JoinProgressType.REGISTER0, nickname: user.nickname, userId: user.id };
    }

    private async withdrawalRequestDetail(userId: string, dto: InputTempUserDTO) {
        const session: ClientSession = await this.connection.startSession();
        session.startTransaction();

        try {
            // tempUser 테이블에 이관작업
            const tempUser = await this.tempUserRepository.createTempUser(dto, session);

            if (!tempUser) {
                throw new CustomException('Failed to save tempUser.', HttpStatus.INTERNAL_SERVER_ERROR, -1615);
            }

            // 일상공유에 등록 정보들이 있는지 체크하고 삭제처리를 한다, 관련 이미지도 같이삭제
            await this.shareDeleterService.withdrawalShareInfo(userId, session);
            // 다이어리 등록 정보들이 있는지 체크하고 삭제처리를 한다, 관련 이미지도 같이삭제
            await this.diaryDeleterService.withdrawalDiaryInfo(userId, session);
            // 이미지(프로필) 등록 정보를 확인하고 삭제처리를 한다.
            await this.imageDeleterService.deleteImageByTypeId(ImageType.Profile, [userId], session);
            // 팔로우 등록 정보들이 있는지 체크하고 삭제처리를 한다.
            await this.userDeleterService.withdrawalFollowInfo(userId, session);
            // 알림(agree)의 등록 정보가 있는지 체크하고 삭제한다.
            await this.notificationAgreeService.withdrawalNotificationInfo(userId, session);
            // 신고에 등록 정보가 있는지 체크하고 삭제한다.
            await this.reportDeleterService.withdrawalReportInfo(userId, session);
            // 마지막으로 회원과 소셜에서 데이터를 삭제처리한다.
            await this.withdrawalSocialWithUserInfo(userId, session);

            await session.commitTransaction();

            return { message: 'Success' };
        } catch (error) {
            await session.abortTransaction();
            throw new CustomExceptionHandler(error).handleException('temp user should be unique values.', -1618);
        } finally {
            await session.endSession();
        }
    }

    private async getSocialWithUserInfo(userId: string) {
        const social = await this.socialRepository
            .findOne({ userId }, { userId: 1, provider: 1, uniqueId: 1 })
            .populate({ path: 'userId', select: 'nickname imageId name phone address' })
            .exec();

        if (!social) {
            throw new CustomException('Not found for the specified social Info by userId.', HttpStatus.NOT_FOUND, -1305);
        }

        return { ...social.Mapper(), userId: Object(social.userId).Mapper() };
    }

    private async withdrawalSocialWithUserInfo(userId: string, session: ClientSession) {
        const result = await this.socialRepository.deleteOne({ userId }, { session }).exec();

        if (result.deletedCount === 0) {
            throw new CustomException('Failed to delete social', HttpStatus.INTERNAL_SERVER_ERROR, -1617);
        }

        await this.userDeleterService.withdrawalUserInfo(userId, session);
    }

    private async restoreTempUserInfo(_id: string, session: ClientSession) {
        const result = await this.tempUserRepository.deleteOne({ _id }, { session }).exec();

        if (result.deletedCount === 0) {
            throw new CustomException('Failed to delete tempUser.', HttpStatus.INTERNAL_SERVER_ERROR, -1619);
        }
    }

    private async restoreRequestDetail(tempUserInfo: Partial<IResponseTempUserDTO>) {
        const session: ClientSession = await this.connection.startSession();
        session.startTransaction();

        try {
            // 유저 테이블과 소셜테이블에 이관작업 생성
            const oldUserId = tempUserInfo.userId as string;
            const newUserId = await this.restoreSocialWithUserInfo(tempUserInfo, session);
            // 일상공유 삭제 정보들이 있는지 체크하고 false로 변경, 관련 이미지도 복원
            await this.shareUpdaterService.restoreShareInfo(oldUserId, newUserId, session);
            // 다이어리 삭제 정보들이 있는지 체크하고 false로 변경, 관련 이미지도 복원
            await this.diaryUpdaterService.restoreDiaryInfo(oldUserId, newUserId, session);
            // 팔로우 삭제 정보들이 있는지 체크하고 복원처리를 한다.
            await this.userUpdaterService.restoreFollowInfo(oldUserId, newUserId, session);
            // 알림(agree)을 새로 생성하고 log의 userId를 복원.
            await this.notificationAgreeService.createAgree(newUserId);
            await this.notificationLogService.restoreLog(oldUserId, newUserId, session);
            // 마지막으로 tempUser에서 유저를 삭제처리한다.
            await this.restoreTempUserInfo(tempUserInfo.id as string, session);
            // 로그인 처리할 수 있도록
            const { accessToken, refreshToken } = await this.authCommonService.tokenGenerationAndStorage(newUserId, session);
            await session.commitTransaction();

            return { type: 'SIGN_IN', accessToken, refreshToken };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
    }

    private async restoreSocialWithUserInfo(userInfo: Partial<IResponseTempUserDTO>, session: ClientSession) {
        const { provider, uniqueId } = userInfo;

        const decryptIfPresent = (value?: string) => (value ? this.authEncryptService.decryptCrypto(value) : undefined);

        const name = decryptIfPresent(userInfo.name);
        const phone = decryptIfPresent(userInfo.phone);
        const address = decryptIfPresent(userInfo.address);

        const user = await this.userWriterService.restoreUser(userInfo, session, name, phone, address);

        const social = await this.socialRepository.createSocial(
            {
                userId: user.id as string,
                provider: provider as SocialProvierType,
                uniqueId: uniqueId as string,
                joinProgress: JoinProgressType.DONE,
            },
            session,
        );

        if (!social) {
            throw new CustomException('Failed to save social.', HttpStatus.INTERNAL_SERVER_ERROR, -1610);
        }

        return user.id as string;
    }
}
