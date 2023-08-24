import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { CookieOptions, Response } from 'express';

import { CreateUserDTO } from '../../dto/user/create-user.dto';
import { InputUserDTO } from '../../dto/user/input-user.dto';
import { IResponseUserDTO } from '../../dto/user/response-user.dto';
import { PBKDF2Service } from '../../utils/cryptography/pbkdf2';
import { RedisService } from '../redis/redis.service';
import { UserRepository } from '../user/user.repository';
import { IJwtPayload } from './interfaces/jwtPayload';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly cryptographyService: PBKDF2Service,
        private readonly redisService: RedisService,
        private readonly jwtService: JwtService,
    ) {}

    async signUp(inputUserDTO: InputUserDTO): Promise<Partial<IResponseUserDTO> | null> {
        const { password } = inputUserDTO;
        const encryptPBKDF2Info = this.cryptographyService.encryptPBKDF2(password);
        if (encryptPBKDF2Info === undefined) {
            throw new BadRequestException('Failed to process the request. Please provide valid input data for sign-up.');
        }

        const { salt, hashedPassword } = encryptPBKDF2Info;
        const cloneUserInfo: CreateUserDTO = Object.assign({}, inputUserDTO, { password: hashedPassword, salt });
        const user = await this.userRepository.createUser(cloneUserInfo);

        return user.view();
    }

    async signIn(loginInfo: Pick<CreateUserDTO, 'userId' | 'password'>): Promise<Partial<IResponseUserDTO> | null> {
        const user = await this.userRepository.findByEmail(loginInfo.userId);
        if (!user) {
            return null;
        }

        const isSamePassword = this.cryptographyService.comparePBKDF2(loginInfo.password, user.salt, user.password);
        if (!isSamePassword) {
            return null;
        }

        return user.view();
    }

    async verifyPayload(payload: IJwtPayload): Promise<Partial<IResponseUserDTO> | undefined> {
        const user = await this.userRepository.findById(payload.sub.id).exec();
        return user?.view();
    }

    /**
     * @description 사용자가 가지고 있는 refresh token이 db에 저장된 토큰값과 일치하는지 확인
     */
    async verifyRefreshToken(token: string, userId: string) {
        const cachedRefreshToken = await this.redisService.get(userId);

        if (token && cachedRefreshToken && token === cachedRefreshToken) {
            return await this.userRepository.findById(userId);
        }

        return null;
    }

    verifyToken(token: string, option?: JwtVerifyOptions): IJwtPayload {
        return this.jwtService.verify(token, option);
    }

    makeAccessAndRefreshToken(userId: Pick<IResponseUserDTO, 'id'>) {
        const { JWT_ACCESS_TOKEN_TIME, JWT_REFRESH_TOKEN_TIME } = process.env;
        const accessToken = this.signToken(userId, { expiresIn: JWT_ACCESS_TOKEN_TIME });
        const refreshToken = this.signToken(userId, { expiresIn: JWT_REFRESH_TOKEN_TIME });

        return { accessToken, refreshToken };
    }

    /**
     * @description respone header 및 cookie 세팅 - accessToken, refreshToken
     */
    setResponseToken(
        response: Response<unknown, Record<string, unknown>>,
        tokens: { accessToken: string; refreshToken: string },
    ) {
        const { accessToken, refreshToken } = tokens;
        const cookieOption: CookieOptions = {
            httpOnly: true,
            signed: true,
            sameSite: 'strict',
            secure: process.env.MODE === 'prod',
        };

        response.setHeader('Authorization', `Bearer ${accessToken}`);
        response.cookie('access_token', accessToken, cookieOption);
        response.cookie('refresh_token', refreshToken, cookieOption);
    }

    private signToken(id: Pick<IResponseUserDTO, 'id'>, options?: JwtSignOptions): string {
        const payload = { sub: { id: id.id } };
        return this.jwtService.sign(payload, options);
    }
}
