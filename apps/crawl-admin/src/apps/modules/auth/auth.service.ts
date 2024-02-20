import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { HttpStatusCode } from 'axios';
import mongoose from 'mongoose';
import { CustomException } from '../../global/error/customException';
import { ROLE } from '../../types/enums/admin.enum';
import { AdminProfile } from '../../types/guards/admin.types';
import { IAdmin } from '../../types/models/admin.model';
import { AdminService, AdminServiceToken } from '../admin/admin.service';
import { CryptoService, CryptoServiceToken } from '../crypto/crypto.service';
import { RegisterDTO } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        @Inject(AdminServiceToken)
        private adminService: AdminService,
        @Inject(CryptoServiceToken)
        private cryptoService: CryptoService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async validateUser(email: string, password: string): Promise<AdminProfile> {
        const user = await this.adminService.findOneByEmail(email);

        if (!user) {
            throw new CustomException('Not Found User', HttpStatusCode.NotFound, -8001);
        }

        const isPasswordMatch = await this.cryptoService.verifyPassword(password, user.password, user.salt);
        if (!isPasswordMatch) {
            throw new CustomException('Password Mismatch Error', HttpStatusCode.UnprocessableEntity, -8001);
        }

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            lastAccessedAt: user.lastAccessedAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    async login(user: AdminProfile) {
        const tokens = await this.issueAccessAndRefreshToken({ email: user.email, id: user.id, role: user.role });
        await this.adminService.updateLoginInfo(user.id, { refreshToken: tokens.refreshToken });
        return tokens;
    }

    async register(body: RegisterDTO) {
        const salt = this.cryptoService.generateSalt();

        try {
            const hashedPassword = await this.cryptoService.hashPassword(body.password, salt);
            const user = await this.adminService.createUser({
                email: body.email,
                name: body.name,
                password: hashedPassword,
                salt,
                role: ROLE.UNDETERMINED,
            });

            const tokens = await this.issueAccessAndRefreshToken({
                email: user.email,
                id: user.id,
                role: user.role,
            });

            await this.adminService.updateRefreshTokenById(user.id, tokens.refreshToken);

            return tokens;
        } catch (err) {
            if (err instanceof Error) {
                if (err.message === 'Failed Hash Password') {
                    throw new CustomException('Failed Hash Password', HttpStatusCode.InternalServerError, -8002);
                }

                if (err instanceof mongoose.mongo.MongoError && err.code === 11000) {
                    throw new CustomException('duplicate email', HttpStatusCode.Conflict, -8003);
                }

                throw new CustomException('Server Error', HttpStatusCode.InternalServerError, -8003);
            }
        }
    }

    private async issueAccessAndRefreshToken(user: Pick<IAdmin, 'email' | 'id' | 'role'>) {
        const accessToken = await this.issueToken({
            type: 'accessToken',
            email: user.email,
            sub: user.id,
            role: user.role,
        });
        const refreshToken = await this.issueToken({ type: 'refreshToken', sub: user.id });
        return { accessToken, refreshToken };
    }

    private async issueToken(payload: object, options?: JwtSignOptions): Promise<string> {
        const secret = this.configService.get('JWT_ACCESS_SECRET_KEY');
        const expiresIn = this.configService.get('JWT_AUTH_TOKEN_TIME');

        return this.jwtService.signAsync(payload, {
            secret,
            expiresIn,
            notBefore: '0h',
            ...options,
        });
    }
}
