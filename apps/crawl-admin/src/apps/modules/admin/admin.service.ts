import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import { Model } from 'mongoose';
import { IAdmin, OTP } from '../../types/models/admin.model';
import { Admin, AdminDocument } from './admin.schema';

export const AdminServiceToken = 'AdminServiceToken';

@Injectable()
export class AdminService {
    constructor(@InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>) {}

    async createUser(dto: Pick<IAdmin, 'email' | 'name' | 'password' | 'salt' | 'role'>) {
        const admin = await this.adminModel.create(dto);
        const savedAdmin = await admin.save();
        return savedAdmin;
    }

    async updateOtpInfoById(id: string, otp: OTP) {
        return this.adminModel.updateOne({ _id: id }, { $set: { otp } });
    }

    async updateLoginInfoById(id: string, info: Pick<IAdmin, 'refreshToken'> & Pick<IAdmin['otp'], 'successAt'>) {
        return this.adminModel.updateOne(
            { _id: id },
            { $set: { refreshToken: info.refreshToken, lastAccessedAt: dayjs(), 'otp.successAt': info.successAt } },
            { upsert: true },
        );
    }

    async updateRefreshTokenById(id: string, refreshToken: string) {
        return this.adminModel.findOneAndUpdate({ _id: id }, { refreshToken }, { upsert: true });
    }

    async findAdminById(id: string) {
        return this.adminModel.findById(id).exec();
    }

    async findOneByEmail(email: string) {
        return this.adminModel.findOne({ email }).exec();
    }
}
