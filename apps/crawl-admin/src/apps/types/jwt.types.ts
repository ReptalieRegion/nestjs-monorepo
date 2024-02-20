import { ROLE } from './enums/admin.enum';

interface JwtPayload {
    type: 'accessToken' | 'refreshToken';
    email: string;
    sub: string;
    role: ROLE;
    iat: number;
    nbf: number;
    exp: number;
}

export type { JwtPayload };
