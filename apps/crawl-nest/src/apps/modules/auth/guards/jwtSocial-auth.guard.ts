import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Request } from 'express';
import { AuthTokenService, AuthTokenServiceToken } from '../service/authToken.service';

@Injectable()
export class JwtSocialAuthGuard extends AuthGuard('jwt') {
    constructor(
        @Inject(AuthTokenServiceToken)
        private readonly authTokenService: AuthTokenService,
    ) {
        super();
    }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<Request>();
        return this.validateRequest(request);
    }

    private validateRequest(request: Request) {
        const authToken = request.headers.authorization?.split('Bearer ')[1] as string;
        return this.authTokenService.verifyAuthToken(authToken);
    }
}
