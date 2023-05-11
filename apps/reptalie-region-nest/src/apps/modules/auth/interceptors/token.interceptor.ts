import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { Response } from 'express';
import { Observable, map } from 'rxjs';

import { IResponseUserDTO } from '../../../dto/user/response-user.dto';
import { RedisService } from '../../redis/redis.service';
import { AuthService } from '../auth.service';

/**
 * @description
 * token을 header와 cookie에 심어서 response
 */
@Injectable()
export class TokenInterceptor implements NestInterceptor {
    constructor(private readonly authService: AuthService, private readonly redisService: RedisService) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler<IResponseUserDTO>,
    ): Observable<Promise<Pick<IResponseUserDTO, 'id'>>> {
        return next.handle().pipe(
            map(async (user) => {
                const response = context.switchToHttp().getResponse<Response>();
                const { accessToken, refreshToken } = this.authService.makeAccessAndRefreshToken({ id: user.id });
                this.authService.setResponseToken(response, { accessToken, refreshToken });
                await this.redisService.set(user.id, refreshToken);

                return user;
            }),
        );
    }
}
