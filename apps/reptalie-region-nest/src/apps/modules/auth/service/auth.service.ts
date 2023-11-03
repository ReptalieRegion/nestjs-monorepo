import {
    BadRequestException,
    ForbiddenException,
    Inject,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { ProviderType } from '../../../dto/user/social/input-social.dto';
import { SocialRepository } from '../repository/social.repository';
import { CryptoService, CryptoServiceToken } from './crypto.service';
import { PBKDF2Service, PBKDF2ServiceToken } from './pbkdf2.service';

export const AuthServiceToken = 'AuthServiceToken';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly socialRepository: SocialRepository,

        @Inject(CryptoServiceToken)
        private readonly cryptoService: CryptoService,
        @Inject(PBKDF2ServiceToken)
        private readonly pbkdf2Service: PBKDF2Service,
    ) {}

    /**
     * 사용자에게 인증 토큰 및 공개 키를 제공합니다.
     *
     * @returns 인증 토큰과 공개 키를 포함하는 객체를 반환합니다.
     */
    async getAuthTokenAndPublicKey() {
        const authToken = await this.issueAuthToken();
        const publicKey = this.cryptoService.getPublicKey();

        return { authToken, publicKey };
    }

    /**
     * 사용자 로그아웃을 수행합니다.
     *
     * @param userId - 로그아웃할 사용자의 ID입니다.
     */
    async logout(userId: string) {
        const result = await this.socialRepository
            .updateOne({ userId }, { $set: { salt: 'defaultValue', refreshToken: 'defaultValue' } })
            .exec();

        if (result.modifiedCount === 0) {
            throw new InternalServerErrorException('Failed to update the refresh token and salt');
        }
    }

    /**
     * 사용자 토큰 생성 및 저장을 처리합니다.
     *
     * @param userId - 토큰을 생성하고 저장할 사용자의 ID입니다.
     * @param provider - 인증 공급자 유형입니다.
     * @returns 생성된 액세스 토큰 및 리프레시 토큰을 반환합니다.
     */
    async tokenGenerationAndStorage(userId: string, provider: ProviderType) {
        const { accessToken, refreshToken } = await this.makeAccessAndRefreshToken(userId);
        const encryptPBKDF2Info = this.pbkdf2Service.encryptPBKDF2(refreshToken);

        if (encryptPBKDF2Info === undefined) {
            throw new BadRequestException('Failed to generate refresh token.');
        }

        const { salt, encryptedData } = encryptPBKDF2Info;
        const encryptedSalt = this.cryptoService.encrypt(salt);

        await this.updateRefreshTokenAndSalt(userId, encryptedData, encryptedSalt, provider);

        return { accessToken, refreshToken };
    }

    /**
     * 리프레시 토큰을 확인하고 새로운 액세스 및 리프레시 토큰을 반환합니다.
     *
     * @param token - 확인할 리프레시 토큰입니다.
     * @returns 새로운 액세스 토큰 및 리프레시 토큰을 반환합니다.
     */
    async verifyRefreshToken(token: string) {
        try {
            const { JWT_REFRESH_SECRET_KEY } = process.env;

            const { payload } = this.jwtService.verify(token, { secret: JWT_REFRESH_SECRET_KEY });
            const social = await this.socialRepository.findOne({ userId: payload.sub.id }).exec();

            if (!social) {
                throw new ForbiddenException('User information not found.');
            }

            const mapperedSocial = social.Mapper();
            const decryptedSalt = this.cryptoService.decrypt(mapperedSocial.salt as string);
            const isMatched = this.pbkdf2Service.comparePBKDF2(token, decryptedSalt, mapperedSocial.refreshToken as string);

            if (!isMatched) {
                await this.logout(mapperedSocial.userId as string);
                throw new ForbiddenException('Refresh token mismatch.');
            }

            const { accessToken, refreshToken } = await this.tokenGenerationAndStorage(
                mapperedSocial.userId as string,
                mapperedSocial.provider as ProviderType,
            );

            return { accessToken, refreshToken };
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new ForbiddenException('The provided token has expired.');
            } else if (error instanceof JsonWebTokenError) {
                throw new ForbiddenException('There was an issue with the JWT (JSON Web Token).');
            } else {
                throw error;
            }
        }
    }

    /**
     * 주어진 액세스 토큰을 확인하고 토큰의 유효성을 검사합니다.
     *
     * @param token - 확인할 액세스 토큰입니다.
     * @returns  확인된 액세스 토큰의 내용을 반환합니다.
     */
    verifyAccessToken(token: string) {
        const { JWT_ACCESS_SECRET_KEY } = process.env;

        try {
            return this.jwtService.verify(token, { secret: JWT_ACCESS_SECRET_KEY });
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new UnauthorizedException('The provided token has expired.');
            } else if (error instanceof JsonWebTokenError) {
                throw new ForbiddenException('There was an issue with the JWT (JSON Web Token).');
            } else {
                throw error;
            }
        }
    }

    /**
     * 주어진 인증 토큰을 확인하고 토큰의 유효성을 검사합니다.
     *
     * @param token - 확인할 인증 토큰입니다.
     * @returns 토큰이 유효한 경우 true를 반환합니다.
     */
    verifyAuthToken(token: string): boolean {
        const { JWT_AUTH_SECRET_KEY } = process.env;

        try {
            this.jwtService.verify(token, { secret: JWT_AUTH_SECRET_KEY });
            return true;
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new ForbiddenException('The provided token has expired.');
            } else if (error instanceof JsonWebTokenError) {
                throw new ForbiddenException('There was an issue with the JWT (JSON Web Token).');
            } else {
                throw error;
            }
        }
    }

    /**
     * 주어진 ID와 옵션을 기반으로 액세스 토큰을 발급합니다.
     *
     * @param id - 토큰에 포함될 ID입니다.
     * @param options - 선택적으로 전달할 JWT 서명 옵션입니다.
     * @returns 발급된 액세스 토큰을 반환합니다.
     */
    private issueAccessToken(id: string, options?: JwtSignOptions): Promise<string> {
        const { JWT_ACCESS_SECRET_KEY, JWT_ACCESS_TOKEN_TIME } = process.env;
        const payload = { sub: { id } };

        return this.jwtService.signAsync(
            { type: 'access', payload },
            {
                secret: JWT_ACCESS_SECRET_KEY,
                expiresIn: JWT_ACCESS_TOKEN_TIME,
                notBefore: '0h',
                ...options,
            },
        );
    }

    /**
     * 주어진 ID와 옵션을 기반으로 리프레시 토큰을 발급합니다.
     *
     * @param id - 토큰에 포함될 ID입니다.
     * @param options - 선택적으로 전달할 JWT 서명 옵션입니다.
     * @returns 발급된 리프레시 토큰을 반환합니다.
     */
    private issueRefreshToken(id: string, options?: JwtSignOptions): Promise<string> {
        const { JWT_REFRESH_SECRET_KEY, JWT_REFRESH_TOKEN_TIME } = process.env;
        const payload = { sub: { id } };

        return this.jwtService.signAsync(
            { type: 'refresh', payload },
            {
                secret: JWT_REFRESH_SECRET_KEY,
                expiresIn: JWT_REFRESH_TOKEN_TIME,
                notBefore: '0h',
                ...options,
            },
        );
    }

    /**
     * 주어진 옵션을 기반으로 인증 토큰을 발급합니다.
     *
     * @param options - 선택적으로 전달할 JWT 서명 옵션입니다.
     * @returns 발급된 인증 토큰을 반환합니다.
     */
    private issueAuthToken(options?: JwtSignOptions): Promise<string> {
        const { JWT_AUTH_SECRET_KEY, JWT_AUTH_TOKEN_TIME } = process.env;

        return this.jwtService.signAsync(
            { type: 'auth' },
            {
                secret: JWT_AUTH_SECRET_KEY,
                expiresIn: JWT_AUTH_TOKEN_TIME,
                notBefore: '0h',
                ...options,
            },
        );
    }

    /**
     * 주어진 사용자 ID를 기반으로 액세스 토큰과 리프레시 토큰을 생성합니다.
     *
     * @param userId - 토큰에 포함될 사용자 ID입니다.
     * @returns 생성된 액세스 토큰과 리프레시 토큰을 반환합니다.
     */
    private async makeAccessAndRefreshToken(userId: string) {
        const accessToken = await this.issueAccessToken(userId);
        const refreshToken = await this.issueRefreshToken(userId);

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
    private async updateRefreshTokenAndSalt(userId: string, refreshToken: string, salt: string, provider: ProviderType) {
        const result = await this.socialRepository.updateOne({ provider, userId }, { $set: { refreshToken, salt } }).exec();

        if (result.modifiedCount === 0) {
            throw new InternalServerErrorException('Failed to update the refresh token and salt');
        }
    }
}
