import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'bson';
import { Model } from 'mongoose';

import { CreateUserDTO } from '../../dto/user/create-user.dto';
import { UserDocument, User } from '../../schemas/user.schema';
import { BaseRepository } from '../base/base.repository';

@Injectable()
export class UserRepository extends BaseRepository<UserDocument> {
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {
        super(userModel);
    }

    async createUser(userInfo: CreateUserDTO) {
        const user = new this.userModel(userInfo);
        return await user.save();
    }

    async findByEmail(email: string) {
        return await this.userModel.findOne({ email }).exec();
    }

    async findByNickname(nickname: string) {
        return await this.userModel.findOne({ nickname }).exec();
    }

    async findByUserId(id: string) {
        return await this.userModel.findById(new ObjectId(id)).exec();
    }
}
