import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SharePostReplieDocument, SharePostReplie } from '../../../schemas/sharePostReplie.schema';
import { BaseRepository } from '../../base/base.repository';

@Injectable()
export class SharePostReplieRepository extends BaseRepository<SharePostReplieDocument> {
    constructor(@InjectModel(SharePostReplie.name) private readonly sharePostReplieModel: Model<SharePostReplieDocument>) {
        super(sharePostReplieModel);
    }
}
