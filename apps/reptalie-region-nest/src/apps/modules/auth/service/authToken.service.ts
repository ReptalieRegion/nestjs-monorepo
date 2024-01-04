import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { CustomException } from '../../../utils/error/customException';
import { IJwtPayload } from '../interfaces/jwtPayload';
import { AuthEncryptService, AuthEncryptServiceToken } from './authEncrypt.service';

export const AuthTokenServiceToken = 'AuthTokenServiceToken';

@Injectable()
export class AuthTokenService {
    constructor(
        private readonly jwtService: JwtService,

        @Inject(AuthEncryptServiceToken)
        private readonly authEncryptService: AuthEncryptService,
    ) {}

    /**
     * 사용자에게 인증 토큰 및 공개 키를 제공합니다.
     *
     * @returns 인증 토큰과 공개 키를 포함하는 객체를 반환합니다.
     */
    async getAuthTokenAndPublicKey() {
        const authToken = await this.issueAuthToken();
        const publicKey = this.authEncryptService.getPublicKey();

        return { authToken, publicKey };
    }

    /**
     * 주어진 사용자 ID를 기반으로 액세스 토큰과 리프레시 토큰을 생성합니다.
     *
     * @param userId - 토큰에 포함될 사용자 ID입니다.
     * @returns 생성된 액세스 토큰과 리프레시 토큰을 반환합니다.
     */
    async issueAccessAndRefreshToken(userId: string) {
        const [accessToken, refreshToken] = await Promise.all([this.issueAccessToken(userId), this.issueRefreshToken(userId)]);

        return { accessToken, refreshToken };
    }

    /**
     * 리프레시 토큰을 확인하고 새로운 액세스 및 리프레시 토큰을 반환합니다.
     *
     * @param token - 확인할 리프레시 토큰입니다.
     * @returns 새로운 액세스 토큰 및 리프레시 토큰을 반환합니다.
     */
    verifyRefreshToken(token: string): IJwtPayload {
        const { JWT_REFRESH_SECRET_KEY } = process.env;

        try {
            return this.jwtService.verify(token, { secret: JWT_REFRESH_SECRET_KEY });
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new CustomException('The provided refresh token has expired.', HttpStatus.FORBIDDEN, -1204);
            } else if (error instanceof JsonWebTokenError) {
                throw new CustomException('There was an issue with the JWT(RefreshToken).', HttpStatus.FORBIDDEN, -1207);
            } else if (error instanceof SyntaxError) {
                throw new CustomException(
                    'There was a syntax error with the provided JWT(RefreshToken).',
                    HttpStatus.FORBIDDEN,
                    -1210,
                );
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
    verifyAccessToken(token: string): IJwtPayload {
        const { JWT_ACCESS_SECRET_KEY } = process.env;

        try {
            return this.jwtService.verify(token, { secret: JWT_ACCESS_SECRET_KEY });
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new CustomException('The provided access token has expired.', HttpStatus.UNAUTHORIZED, -1101);
            } else if (error instanceof JsonWebTokenError) {
                throw new CustomException('There was an issue with the JWT(AccessToken).', HttpStatus.FORBIDDEN, -1206);
            } else if (error instanceof SyntaxError) {
                throw new CustomException(
                    'There was a syntax error with the provided JWT(AccessToken).',
                    HttpStatus.FORBIDDEN,
                    -1209,
                );
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
                throw new CustomException('The provided auth token has expired.', HttpStatus.FORBIDDEN, -1203);
            } else if (error instanceof JsonWebTokenError) {
                throw new CustomException('There was an issue with the JWT(AuthToken).', HttpStatus.FORBIDDEN, -1205);
            } else if (error instanceof SyntaxError) {
                throw new CustomException(
                    'There was a syntax error with the provided JWT(AuthToken).',
                    HttpStatus.FORBIDDEN,
                    -1208,
                );
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
}
