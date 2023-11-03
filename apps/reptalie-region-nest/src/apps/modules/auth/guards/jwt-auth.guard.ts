import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Request } from 'express';
import { UserSearcherService, UserSearcherServiceToken } from '../../user/service/userSearcher.service';
import { AuthService, AuthServiceToken } from '../service/auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        @Inject(AuthServiceToken)
        private readonly authService: AuthService,
        @Inject(UserSearcherServiceToken)
        private readonly userSearcherService: UserSearcherService,
    ) {
        super();
    }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<Request>();
        const { payload } = this.validateRequest(request);

        const user = this.userSearcherService.getUserInfo({ targetUserId: payload.sub.id });

        request.user = user;
        return true;
    }

    private validateRequest(request: Request) {
        const accessToken = request.headers.authorization?.split('Bearer ')[1] as string;
        return this.authService.verifyAccessToken(accessToken);
    }
}
