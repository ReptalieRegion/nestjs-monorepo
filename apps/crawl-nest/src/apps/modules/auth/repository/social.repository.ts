import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Social, SocialDocument } from '@private-crawl/models';
import { ClientSession, Model } from 'mongoose';

import { InputSocialDTO } from '../../../dto/user/social/input-social.dto';

import { BaseRepository } from '../../base/base.repository';

@Injectable()
export class SocialRepository extends BaseRepository<SocialDocument> {
    constructor(@InjectModel(Social.name) private readonly socialModel: Model<SocialDocument>) {
        super(socialModel);
    }

    async createSocial(dto: InputSocialDTO, session: ClientSession) {
        const social = new this.socialModel(dto);
        const savedSocial = await social.save({ session });
        return savedSocial.Mapper();
    }
}
