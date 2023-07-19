import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SharePostCommentDocument, SharePostComment } from '../../../schemas/sharePostComment.schema';
import { BaseRepository } from '../../base/base.repository';

@Injectable()
export class SharePostCommentRepository extends BaseRepository<SharePostCommentDocument> {
    constructor(@InjectModel(SharePostComment.name) private readonly sharePostCommentModel: Model<SharePostCommentDocument>) {
        super(sharePostCommentModel);
    }
}
