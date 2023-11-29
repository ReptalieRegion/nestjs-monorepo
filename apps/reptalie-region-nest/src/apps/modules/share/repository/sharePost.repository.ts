import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'bson';
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

    async getPostOwnerFCMToken(postId: string) {
        const fcmTokenArray = await this.sharePostModel.aggregate<{ fcmToken: string[] }>([
            {
                $match: {
                    _id: new ObjectId(postId),
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $project: {
                    fcmToken: '$user.fcmToken',
                },
            },
        ]);
        console.log(fcmTokenArray);

        if (fcmTokenArray.length < 1 || fcmTokenArray[0].fcmToken.length < 1) {
            throw new Error('[GetPostOwnerFCMToken] Not Found');
        }

        return fcmTokenArray[0].fcmToken[0];
    }
}
