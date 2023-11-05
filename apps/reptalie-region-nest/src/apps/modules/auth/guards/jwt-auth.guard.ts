import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Request } from 'express';
import { UserSearcherService, UserSearcherServiceToken } from '../../user/service/userSearcher.service';
import { AuthTokenService, AuthTokenServiceToken } from '../service/authToken.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        @Inject(AuthTokenServiceToken)
        private readonly authTokenService: AuthTokenService,
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
        return this.authTokenService.verifyAccessToken(accessToken);
    }
}
