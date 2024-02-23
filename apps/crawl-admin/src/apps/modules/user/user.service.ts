import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@private-crawl/models';
import { Model } from 'mongoose';

export const UserServiceToken = 'UserServiceToken';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private readonly configService: ConfigService,
    ) {}

    async findUsersInfo(pageNumber: number, pageSize: number) {
        return this.userModel.aggregate([
            {
                $skip: pageNumber * pageSize,
            },
            {
                $limit: pageSize,
            },
            {
                $lookup: {
                    from: 'images',
                    localField: 'imageId',
                    foreignField: '_id',
                    as: 'image',
                },
            },
            {
                $lookup: {
                    from: 'shareposts',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'sharePosts',
                },
            },
            {
                $lookup: {
                    from: 'diaryentities',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'entity',
                },
            },
            {
                $unwind: '$image',
            },
            {
                $addFields: {
                    postCount: { $size: '$sharePosts' },
                    entityCount: { $size: '$entity' },
                    'profile.src': {
                        $concat: [this.configService.get('AWS_IMAGE_BASEURL'), '$image.imageKey'],
                    },
                },
            },
            {
                $project: {
                    nickname: 1,
                    lastAccessAt: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    deviceInfo: 1,
                    profile: 1,
                    postCount: 1,
                    entityCount: 1,
                },
            },
        ]);
    }

    async findUserTotalCount() {
        return this.userModel.countDocuments();
    }
}
