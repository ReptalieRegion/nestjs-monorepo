import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { ClientSession } from 'mongoose';
import { EncryptedDataDTO } from '../../../dto/user/social/encryptedData.dto';
import { InputSocialDTO, JoinProgressType, ProviderType } from '../../../dto/user/social/input-social.dto';
import { UserWriterService, UserWriterServiceToken } from '../../user/service/userWriter.service';
import { SocialRepository } from '../repository/social.repository';
import { AuthService, AuthServiceToken } from './auth.service';
import { CryptoService, CryptoServiceToken } from './crypto.service';

export const KakaoServiceToken = 'KakaoServiceToken';

@Injectable()
export class KakaoService {
    constructor(
        private readonly socialRepository: SocialRepository,

        @InjectConnection()
        private readonly connection: mongoose.Connection,

        @Inject(CryptoServiceToken)
        private readonly cryptoService: CryptoService,
        @Inject(AuthServiceToken)
        private readonly authService: AuthService,
        @Inject(UserWriterServiceToken)
        private readonly userWriterService: UserWriterService,
    ) {}

    async kakaoSignIn(dto: EncryptedDataDTO) {
        const decryptedData = this.cryptoService.decrypt(dto.encryptedData);

        const isExistsSocial = await this.socialRepository
            .findOne({ provider: ProviderType.Kakao, uniqueId: decryptedData })
            .populate({ path: 'userId', select: 'nickname' })
            .exec();

        if (isExistsSocial) {
            const user = Object(isExistsSocial?.userId).Mapper();
            if (isExistsSocial.joinProgress === JoinProgressType.DONE) {
                const token = await this.authService.tokenGenerationAndStorage(user.id, ProviderType.Kakao);
                return { type: 'SIGN_IN', accessToken: token.accessToken, refreshToken: token.refreshToken };
            }

            return { type: 'SIGN_UP', joinProgress: isExistsSocial.joinProgress, nickname: user.nickname, userId: user.id };
        } else {
            return this.kakaoSignUp(decryptedData);
        }
    }

    private async kakaoSignUp(socialId: string) {
        const session: ClientSession = await this.connection.startSession();
        session.startTransaction();

        try {
            const user = await this.userWriterService.createUser(session);

            const inputSocialData: InputSocialDTO = {
                userId: user.id as string,
                provider: ProviderType.Kakao,
                uniqueId: socialId,
                joinProgress: JoinProgressType.REGISTER0,
            };

            await this.socialRepository.createSocial(inputSocialData, session);
            await session.commitTransaction();

            return { type: 'SIGN_UP', joinProgress: JoinProgressType.REGISTER0, nickname: user.nickname, userId: user.id };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
    }
}
