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

    async createPost(userId: string, sharePostInfo: InputSharePostDTO, session: ClientSession) {
        const sharePost = new this.sharePostModel({ ...sharePostInfo, userId });
        const savedSharePost = await sharePost.save({ session });
        return savedSharePost.Mapper();
    }

    async findPostWithUserId(postId: string, userId: string) {
        const sharePost = await this.sharePostModel
            .findOne({ _id: new ObjectId(postId), userId: new ObjectId(userId), isDeleted: false }, { _id: 1 })
            .exec();
        return sharePost?.Mapper();
    }

    async updatePost(postId: string, userId: string, contents: string, session: ClientSession) {
        const response = await this.sharePostModel
            .updateOne(
                { _id: new ObjectId(postId), userId: new ObjectId(userId), isDeleted: false },
                { $set: { contents } },
                { session },
            )
            .exec();
        return response.modifiedCount;
    }

    async deletePost(postId: string, userId: string, session: ClientSession) {
        const response = await this.sharePostModel
            .updateOne(
                { _id: new ObjectId(postId), userId: new ObjectId(userId), isDeleted: false },
                { $set: { isDeleted: true } },
                { session },
            )
            .exec();
        return response.modifiedCount;
    }
}
