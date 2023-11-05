import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { ClientSession } from 'mongoose';
import { JoinProgressType, ProviderType, IEncryptedData } from '../../../dto/user/social/input-social.dto';
import { UserWriterService, UserWriterServiceToken } from '../../user/service/userWriter.service';
import { SocialRepository } from '../repository/social.repository';
import { AuthCommonService, AuthCommonServiceToken } from './authCommon.service';
import { AuthEncryptService, AuthEncryptServiceToken } from './authEncrypt.service';

export const AuthSocialServiceToken = 'AuthSocialServiceToken';

@Injectable()
export class AuthSocialService {
    constructor(
        private readonly socialRepository: SocialRepository,

        @InjectConnection()
        private readonly connection: mongoose.Connection,

        @Inject(AuthEncryptServiceToken)
        private readonly authEncryptService: AuthEncryptService,
        @Inject(AuthCommonServiceToken)
        private readonly authCommonService: AuthCommonService,
        @Inject(UserWriterServiceToken)
        private readonly userWriterService: UserWriterService,
    ) {}

    /**
     * Kakao로부터의 로그인 요청을 처리합니다.
     *
     * @param dto - 암호화된 데이터를 포함하는 데이터 전송 객체 (IEncryptedData).
     * @returns - Kakao 로그인에 대한 결과를 반환합니다. 이미 가입한 사용자의 경우 로그인 정보를 제공하고,
     *            새로운 사용자의 경우 회원가입 정보를 제공합니다.
     */
    async kakaoSignIn(dto: IEncryptedData) {
        const session: ClientSession = await this.connection.startSession();
        session.startTransaction();

        try {
            const decryptedData = this.authEncryptService.decryptCrypto(dto.encryptedData);

            const socialProfile = await this.socialRepository
                .findOne({ provider: ProviderType.Kakao, uniqueId: decryptedData })
                .populate({ path: 'userId', select: 'nickname' })
                .exec();

            let result, token;

            if (socialProfile) {
                const user = Object(socialProfile.userId).Mapper();

                if (socialProfile.joinProgress === JoinProgressType.DONE) {
                    token = await this.authCommonService.tokenGenerationAndStorage(user.id, session);

                    result = { type: 'SIGN_IN', accessToken: token.accessToken, refreshToken: token.refreshToken };
                } else {
                    result = {
                        type: 'SIGN_UP',
                        joinProgress: socialProfile.joinProgress,
                        nickname: user.nickname,
                        userId: user.id,
                    };
                }
            } else {
                result = await this.socialSignUp(decryptedData, ProviderType.Kakao, session);
            }

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
     * 소셜 로그인을 통해 새로운 사용자를 등록합니다.
     *
     * @param uniqueId - 소셜 고유 식별자.
     * @param provider - 소셜 제공자 타입.
     * @param session - 데이터베이스 세션.
     * @returns - 회원가입 정보를 포함하는 결과를 반환합니다.
     */
    private async socialSignUp(uniqueId: string, provider: ProviderType, session: ClientSession) {
        const user = await this.userWriterService.createUser(session);

        const social = await this.socialRepository.createSocial(
            { userId: user.id as string, provider, uniqueId, joinProgress: JoinProgressType.REGISTER0 },
            session,
        );

        if (!social) {
            throw new InternalServerErrorException('Failed to save social.');
        }

        return { type: 'SIGN_UP', joinProgress: JoinProgressType.REGISTER0, nickname: user.nickname, userId: user.id };
    }
}
