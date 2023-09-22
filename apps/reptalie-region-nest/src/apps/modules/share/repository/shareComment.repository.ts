import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { InputShareCommentDTO } from '../../../dto/share/comment/input-shareComment.dto';
import { ShareCommentDocument, ShareComment } from '../../../schemas/shareComment.schema';
import { BaseRepository } from '../../base/base.repository';

@Injectable()
export class ShareCommentRepository extends BaseRepository<ShareCommentDocument> {
    constructor(@InjectModel(ShareComment.name) private readonly shareCommentModel: Model<ShareCommentDocument>) {
        super(shareCommentModel);
    }

    async createComment(userId: string, commentInfo: InputShareCommentDTO) {
        const comment = new this.shareCommentModel({ ...commentInfo, userId });
        const savedComment = await comment.save();
        return savedComment.Mapper();
    }
}
