import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';

import { InputTempUserDTO } from '../../../dto/user/tempUser/input-tempUser.dto';
import { TempUser, TempUserDocument } from '../../../schemas/tempUser.schema';
import { BaseRepository } from '../../base/base.repository';

@Injectable()
export class TempUserRepository extends BaseRepository<TempUserDocument> {
    constructor(@InjectModel(TempUser.name) private readonly tempUserModel: Model<TempUserDocument>) {
        super(tempUserModel);
    }

    async createTempUser(dto: InputTempUserDTO, session: ClientSession) {
        const tempUser = new this.tempUserModel(dto);
        const savedTempUser = await tempUser.save({ session });
        return savedTempUser.Mapper();
    }
}
