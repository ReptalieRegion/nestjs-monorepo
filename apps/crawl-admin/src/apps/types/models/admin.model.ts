import { SchemaId } from '@private-crawl/types';
import { ROLE } from '../enums/admin.enum';

type OTP = {
    code: string;
    createdAt: Date;
    successAt: Date;
};

interface IAdmin {
    _id: SchemaId;
    id: string;
    email: string;
    name: string;
    password: string;
    salt: string;
    refreshToken: string;
    otp: OTP;
    role: ROLE;
    lastAccessedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export type { OTP, IAdmin };
