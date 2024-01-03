import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';

import { InputSharePostDTO } from '../../../dto/share/post/input-sharePost.dto';
import { SharePost, SharePostDocument } from '../../../schemas/sharePost.schema';
import { BaseRepository } from '../../base/base.repository';

@Injectable()
export class SharePostRepository extends BaseRepository<SharePostDocument> {
    constructor(@InjectModel(SharePost.name) private readonly sharePostModel: Model<SharePostDocument>) {
        super(sharePostModel);
    }

    async createPost(userId: string, sharePostInfo: InputSharePostDTO, session: ClientSession) {
        const sharePost = new this.sharePostModel({ ...sharePostInfo, userId });
        const savedSharePost = await sharePost.save({ session });
        return savedSharePost.Mapper();
    }
}
