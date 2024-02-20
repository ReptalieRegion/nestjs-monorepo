import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HttpStatusCode } from 'axios';
import { Request } from 'express';
import { CustomException } from '../../../global/error/customException';
import { AdminService, AdminServiceToken } from '../../admin/admin.service';
import { AuthService, AuthServiceToken } from '../auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        @Inject(AuthServiceToken)
        private readonly authService: AuthService,
        @Inject(AdminServiceToken)
        private readonly adminService: AdminService,
    ) {
        super();
    }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<Request>();
        const accessToken = request.cookies?.access_token;

        if (accessToken) {
            const payload = await this.authService.verifyToken(accessToken);
            const user = await this.adminService.findAdminById(payload.sub);
            if (!user) {
                throw new CustomException('Not Found User', HttpStatusCode.NotFound, -1301);
            }
            request.user = user;
            return true;
        }

        return false;
    }
}
