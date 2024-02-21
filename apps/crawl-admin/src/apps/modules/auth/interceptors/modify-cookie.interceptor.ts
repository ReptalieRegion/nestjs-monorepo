import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface InterceptorData {
    accessToken: string;
    refreshToken: string;
}

@Injectable()
export class ModifyCookieInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<InterceptorData> {
        return next.handle().pipe(
            tap<InterceptorData>(({ accessToken, refreshToken }) => {
                const response = context.switchToHttp().getResponse() as Response;
                response.setHeader('Authorization', 'Bearer ' + accessToken);
                response.cookie('access_token', accessToken, {
                    httpOnly: true,
                    sameSite: true,
                    secure: true,
                    maxAge: 1 * 24 * 60 * 60 * 1000,
                });
                response.cookie('refresh_token', refreshToken, {
                    httpOnly: true,
                    sameSite: true,
                    secure: true,
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
            }),
        );
    }
}
