import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { AdminProfile } from '../../types/guards/admin.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminService, AdminServiceToken } from './admin.service';

@Controller('/admin')
export class AdminController {
    constructor(@Inject(AdminServiceToken) private readonly adminService: AdminService) {}

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getAdmin(@AuthUser(['id', 'email', 'name', 'role']) user: Pick<AdminProfile, 'id' | 'email' | 'name' | 'role'>) {
        return user;
    }
}
