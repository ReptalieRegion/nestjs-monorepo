import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import { Model } from 'mongoose';
import { IAdmin } from '../../types/models/admin.model';
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

    async updateLoginInfo(id: string, info: Pick<IAdmin, 'refreshToken'>) {
        return this.adminModel.updateOne(
            { _id: id },
            { refreshToken: info.refreshToken, lastAccessedAt: dayjs() },
            { upsert: true },
        );
    }

    async updateRefreshTokenById(id: string, refreshToken: string) {
        return this.adminModel.findOneAndUpdate({ _id: id }, { refreshToken }, { upsert: true });
    }

    async findOneByEmail(email: string) {
        return this.adminModel.findOne({ email }).exec();
    }
}
