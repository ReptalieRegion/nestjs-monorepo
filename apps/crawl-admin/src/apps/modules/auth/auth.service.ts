import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { HttpStatusCode } from 'axios';
import mongoose from 'mongoose';
import { CustomException } from '../../global/error/customException';
import { ROLE } from '../../types/enums/admin.enum';
import { AdminProfile } from '../../types/guards/admin.types';
import { JwtPayload } from '../../types/jwt.types';
import { IAdmin } from '../../types/models/admin.model';
import { AdminService, AdminServiceToken } from '../admin/admin.service';
import { CryptoService, CryptoServiceToken } from '../crypto/crypto.service';
import { RegisterDTO } from './dto/register.dto';

export const AuthServiceToken = 'AuthServiceToken';

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

    async verifyToken(token: string): Promise<JwtPayload> {
        const secret = this.configService.get('JWT_ACCESS_SECRET_KEY');

        try {
            return this.jwtService.verify(token, { secret });
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new CustomException('The provided access token has expired.', HttpStatus.UNAUTHORIZED, -1101);
            } else if (error instanceof JsonWebTokenError) {
                throw new CustomException('There was an issue with the JWT(AccessToken).', HttpStatus.FORBIDDEN, -1201);
            } else if (error instanceof SyntaxError) {
                throw new CustomException(
                    'There was a syntax error with the provided JWT(AccessToken).',
                    HttpStatus.FORBIDDEN,
                    -1202,
                );
            } else {
                throw error;
            }
        }
    }

    async validateUser(email: string, password: string): Promise<AdminProfile> {
        const user = await this.adminService.findOneByEmail(email);

        if (!user) {
            throw new CustomException('Not Found User', HttpStatusCode.NotFound, -1301);
        }

        const isPasswordMatch = await this.cryptoService.verifyPassword(password, user.password, user.salt);
        if (!isPasswordMatch) {
            throw new CustomException('Password Mismatch Error', HttpStatusCode.UnprocessableEntity, -1501);
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
                    throw new CustomException('Failed Hash Password', HttpStatusCode.InternalServerError, -1601);
                }

                if (err instanceof mongoose.mongo.MongoError && err.code === 11000) {
                    throw new CustomException('duplicate email', HttpStatusCode.Conflict, -1701);
                }

                throw new CustomException('Server Error', HttpStatusCode.InternalServerError, -1602);
            }
        }
    }

    private async issueAccessAndRefreshToken(user: Pick<IAdmin, 'email' | 'id' | 'role'>) {
        const secret = this.configService.get('JWT_ACCESS_SECRET_KEY');
        const accessExpiresIn = this.configService.get('JWT_ACCESS_TOKEN_TIME');
        const refreshExpiresIn = this.configService.get('JWT_REFRESH_TOKEN_TIME');
        const accessToken = await this.jwtService.signAsync(
            {
                type: 'accessToken',
                email: user.email,
                sub: user.id,
                role: user.role,
            },
            {
                secret,
                expiresIn: accessExpiresIn,
            },
        );
        const refreshToken = await this.jwtService.signAsync(
            {
                type: 'refreshToken',
                sub: user.id,
            },
            {
                secret,
                expiresIn: refreshExpiresIn,
            },
        );
        return { accessToken, refreshToken };
    }
}
