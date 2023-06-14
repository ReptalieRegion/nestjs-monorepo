import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SharePostDocument, SharePost } from '../../../schemas/sharePost.schema';
import { BaseRepository } from '../../base/base.repository';

@Injectable()
export class SharePostRepository extends BaseRepository<SharePostDocument> {
    constructor(@InjectModel(SharePost.name) private readonly sharePostModel: Model<SharePostDocument>) {
        super(sharePostModel);
    }
}
