import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'bson';
import { Model, ClientSession } from 'mongoose';

import { InputSharePostDTO } from '../../../dto/share/post/input-sharePost.dto';
import { SharePostDocument, SharePost } from '../../../schemas/sharePost.schema';
import { BaseRepository } from '../../base/base.repository';

@Injectable()
export class SharePostRepository extends BaseRepository<SharePostDocument> {
    constructor(@InjectModel(SharePost.name) private readonly sharePostModel: Model<SharePostDocument>) {
        super(sharePostModel);
    }

    async createSharePost(sharePostInfo: InputSharePostDTO, session: ClientSession) {
        const sharePost = new this.sharePostModel(sharePostInfo);
        const savedSharePost = await sharePost.save({ session });
        return savedSharePost.Mapper();
    }

    async findByPostId(id: string) {
        const sharePost = await this.sharePostModel.findOne({ _id: new ObjectId(id) }).exec();
        return sharePost?.Mapper();
    }

    async findPostIdById(id: string) {
        const sharePost = await this.sharePostModel.findOne({ _id: new ObjectId(id) }, { _id: 1 }).exec();
        return sharePost?.Mapper();
    }
}
