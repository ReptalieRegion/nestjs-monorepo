import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';

import { InputSharePostDTO } from '../../../dto/sharePost/input-sharePost.dto';
import { SharePostDocument, SharePost } from '../../../schemas/sharePost.schema';
import { BaseRepository } from '../../base/base.repository';

@Injectable()
export class SharePostRepository extends BaseRepository<SharePostDocument> {
    constructor(@InjectModel(SharePost.name) private readonly sharePostModel: Model<SharePostDocument>) {
        super(sharePostModel);
    }

    async createSharePost(SharePostInfo: InputSharePostDTO, session: ClientSession) {
        const sharePost = new this.sharePostModel(SharePostInfo);
        const savedSharePost = await sharePost.save({ session });
        return savedSharePost.view();
    }

    startSession() {
        return this.sharePostModel.startSession();
    }
}
