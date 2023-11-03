import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';

import { InputUserDTO } from '../../../dto/user/user/input-user.dto';
import { UserDocument, User } from '../../../schemas/user.schema';
import { BaseRepository } from '../../base/base.repository';

@Injectable()
export class UserRepository extends BaseRepository<UserDocument> {
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {
        super(userModel);
    }

    async createUser(dto: InputUserDTO, session: ClientSession) {
        const user = new this.userModel(dto);
        const savedUser = await user.save({ session });
        return savedUser.Mapper();
    }

    async findByEmail(email: string) {
        return await this.userModel.findOne({ userId: email }).exec();
    }
}
