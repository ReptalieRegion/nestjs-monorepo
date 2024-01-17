import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';

import { InputSocialDTO } from '../../../dto/user/social/input-social.dto';
import { SocialDocument, Social } from '../../../schemas/social.schema';
import { BaseRepository } from '../../base/base.repository';

@Injectable()
export class SocialRepository extends BaseRepository<SocialDocument> {
    constructor(@InjectModel(Social.name) private readonly socialModel: Model<SocialDocument>) {
        super(socialModel);
    }

    async createSocial(dto: InputSocialDTO, session: ClientSession) {
        console.log(dto);
        const social = new this.socialModel(dto);
        const savedSocial = await social.save({ session });
        return savedSocial.Mapper();
    }
}
