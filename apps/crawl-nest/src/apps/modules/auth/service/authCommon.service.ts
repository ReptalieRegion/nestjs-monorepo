import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { JoinProgressType } from '@private-crawl/types';
import mongoose, { ClientSession } from 'mongoose';
import { IJoinProgressDTO } from '../../../dto/user/social/input-social.dto';
import { CustomException } from '../../../utils/error/customException';
import { disassembleHangulToGroups } from '../../../utils/hangul/disassemble';
import { NotificationSlackService, NotificationSlackServiceToken } from '../../notification/service/notificationSlack.service';
import { UserUpdaterService, UserUpdaterServiceToken } from '../../user/service/userUpdater.service';
import { SocialRepository } from '../repository/social.repository';
import { AuthEncryptService, AuthEncryptServiceToken } from './authEncrypt.service';
import { AuthTokenService, AuthTokenServiceToken } from './authToken.service';

export const AuthCommonServiceToken = 'AuthCommonServiceToken';

@Injectable()
export class AuthCommonService {
    constructor(
        private readonly socialRepository: SocialRepository,

        @InjectConnection()
        private readonly connection: mongoose.Connection,

        @Inject(AuthEncryptServiceToken)
        private readonly authEncryptService: AuthEncryptService,
        @Inject(AuthTokenServiceToken)
        private readonly authTokenService: AuthTokenService,
        @Inject(UserUpdaterServiceToken)
        private readonly userUpdaterService: UserUpdaterService,
        @Inject(NotificationSlackServiceToken)
        private readonly slackService: NotificationSlackService,
    ) {}

    /**
     * 사용자의 가입 진행 상태 처리를 수행합니다.
     *
     * @param dto - 가입 진행 상태를 나타내는 데이터 전송 객체 (IJoinProgressDTO).
     * @returns - 사용자의 가입 진행 상태가 업데이트된 후, 결과를 반환합니다.
     */
    async handleJoinProgress(dto: IJoinProgressDTO) {
        const session: ClientSession = await this.connection.startSession();
        session.startTransaction();

        try {
            const { userId, nickname } = dto;
            const initials = disassembleHangulToGroups(nickname)
                .flatMap((values) => values[0])
                .join('');

            await this.userUpdaterService.updateNickname(nickname, initials, userId, session);

            const result = await this.socialRepository
                .updateOne({ userId }, { $set: { joinProgress: JoinProgressType.DONE } }, { session })
                .exec();

            if (result.modifiedCount === 0) {
                throw new CustomException('Failed to update social join-progress.', HttpStatus.INTERNAL_SERVER_ERROR, -1614);
            }

            const { accessToken, refreshToken } = await this.tokenGenerationAndStorage(userId, session);
            await session.commitTransaction();

            this.slackService.send(`*신규 가입* ${nickname}`, '신규가입');
            return { type: 'SIGN_UP', joinProgress: JoinProgressType.DONE, accessToken, refreshToken };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
    }

    /**
     * 리프레시 토큰을 확인하고 새로운 액세스 및 리프레시 토큰을 반환합니다.
     *
     * @param token - 확인할 리프레시 토큰입니다.
     * @returns 새로운 액세스 토큰 및 리프레시 토큰을 반환합니다.
     */
    async verifyRefreshToken(token: string) {
        const session: ClientSession = await this.connection.startSession();
        session.startTransaction();

        try {
            const { payload } = this.authTokenService.verifyRefreshToken(token);
            const social = await this.socialRepository.findOne({ userId: payload.sub.id }).exec();
            if (!social) {
                throw new CustomException('Not found for the specified user social info.', HttpStatus.FORBIDDEN, -1201);
            }

            const mapSocial = social.Mapper();
            const decryptedSalt = this.authEncryptService.decryptCrypto(mapSocial.salt as string);

            const isMatched = this.authEncryptService.comparePBKDF2(token, decryptedSalt, mapSocial.refreshToken as string);
            if (!isMatched) {
                await this.signOut(mapSocial.userId as string);
                throw new CustomException('Refresh token mismatch.', HttpStatus.FORBIDDEN, -1202);
            }

            const { accessToken, refreshToken } = await this.tokenGenerationAndStorage(mapSocial.userId as string, session);
            await session.commitTransaction();

            return { accessToken, refreshToken };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
    }

    /**
     * 사용자 로그아웃을 수행합니다.
     *
     * @param userId - 로그아웃할 사용자의 ID입니다.
     */
    async signOut(userId: string) {
        const result = await this.socialRepository
            .updateOne({ userId }, { $set: { salt: 'defaultValue', refreshToken: 'defaultValue' } })
            .exec();

        if (result.modifiedCount === 0) {
            throw new CustomException('Failed to delete the refresh token and salt.', HttpStatus.INTERNAL_SERVER_ERROR, -1612);
        }

        return { message: 'Success' };
    }

    /**
     * 사용자 토큰 생성 및 저장을 처리합니다.
     *
     * @param userId - 토큰을 생성하고 저장할 사용자의 ID입니다.
     * @param provider - 인증 공급자 유형입니다.
     * @returns 생성된 액세스 토큰 및 리프레시 토큰을 반환합니다.
     */
    async tokenGenerationAndStorage(userId: string, session: ClientSession) {
        const { accessToken, refreshToken } = await this.authTokenService.issueAccessAndRefreshToken(userId);
        const encryptPBKDF2Info = this.authEncryptService.encryptPBKDF2(refreshToken);

        if (encryptPBKDF2Info === undefined) {
            throw new CustomException('Failed to generate refresh token.', HttpStatus.BAD_REQUEST, -1003);
        }

        const { salt, encryptedData } = encryptPBKDF2Info;
        const encryptedSalt = this.authEncryptService.encryptCrypto(salt);

        await this.updateRefreshTokenAndSalt(userId, encryptedData, encryptedSalt, session);

        return { accessToken, refreshToken };
    }

    /**
     * 주어진 사용자 ID, 리프레시 토큰 및 솔트를 사용해 데이터베이스에 리프레시 토큰과 솔트를 업데이트합니다.
     *
     * @param userId - 사용자 ID입니다.
     * @param refreshToken - 업데이트할 리프레시 토큰입니다.
     * @param salt - 업데이트할 솔트입니다.
     * @param provider - 사용자 공급자 유형입니다.
     */
    private async updateRefreshTokenAndSalt(userId: string, refreshToken: string, salt: string, session: ClientSession) {
        const result = await this.socialRepository.updateOne({ userId }, { $set: { refreshToken, salt } }, { session }).exec();

        if (result.modifiedCount === 0) {
            throw new CustomException('Failed to update the refresh token and salt.', HttpStatus.INTERNAL_SERVER_ERROR, -1608);
        }
    }
}
