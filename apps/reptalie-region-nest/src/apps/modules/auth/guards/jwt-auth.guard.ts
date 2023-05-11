import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Request, Response } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';

import { RedisService } from '../../redis/redis.service';
import { AuthService } from '../auth.service';
import { JwtStrategy } from '../strategies/jwt.strategy';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private readonly authService: AuthService,
        private readonly jwtStrategy: JwtStrategy,
        private readonly redisService: RedisService,
    ) {
        super();
    }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();
        const { authorization } = request.headers;

        if (!authorization) {
            throw new UnauthorizedException();
        }

        const token = authorization.replace('Bearer ', '');

        try {
            const result = this.authService.verifyToken(token);
            if (!result) {
                throw new UnauthorizedException();
            }

            const user = await this.jwtStrategy.validate(result);
            if (!user) {
                throw new UnauthorizedException();
            }

            request.user = user;
            return true;
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                const legacyRefreshToken = request.signedCookies['refresh_token'];
                const { sub } = this.authService.verifyToken(token, { ignoreExpiration: true });
                const userId = sub.id;
                const user = await this.authService.verifyRefreshToken(legacyRefreshToken, userId);

                if (user) {
                    const { accessToken, refreshToken } = this.authService.makeAccessAndRefreshToken(user.id);
                    this.authService.setResponseToken(response, { accessToken, refreshToken });
                    await this.redisService.set(user.id, refreshToken);
                    request.user = user;
                    return true;
                }

                await this.redisService.del(userId);
            }

            throw new UnauthorizedException();
        }
    }
}