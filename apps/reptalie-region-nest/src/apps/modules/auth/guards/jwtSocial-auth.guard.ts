import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Request } from 'express';
import { AuthService, AuthServiceToken } from '../service/auth.service';

@Injectable()
export class JwtSocialAuthGuard extends AuthGuard('jwt') {
    constructor(
        @Inject(AuthServiceToken)
        private readonly authService: AuthService,
    ) {
        super();
    }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<Request>();
        return this.validateRequest(request);
    }

    private validateRequest(request: Request) {
        const authToken = request.headers.authorization?.split('Bearer ')[1] as string;
        return this.authService.verifyAuthToken(authToken);
    }
}
