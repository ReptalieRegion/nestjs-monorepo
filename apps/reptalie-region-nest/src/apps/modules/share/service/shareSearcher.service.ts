import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { BSONError } from 'bson';
import { ShareCommentRepository } from '../repository/shareComment.repository';
import { SharePostRepository } from '../repository/sharePost.repository';

export const ShareSearcherServiceToken = 'ShareSearcherServiceToken';

@Injectable()
export class ShareSearcherService {
    constructor(
        private readonly sharePostRepository: SharePostRepository,
        private readonly shareCommentRepository: ShareCommentRepository,
    ) {}

    async findBySharePostId(id: string) {
        const sharePost = await this.sharePostRepository.findByPostId(id);

        if (!sharePost) {
            throw new NotFoundException('SharePost ID does not exist');
        }

        return sharePost;
    }

    async isExistsPostId(id: string) {
        try {
            const sharePost = await this.sharePostRepository.findPostIdById(id);

            if (!sharePost) {
                throw new NotFoundException('SharePost ID does not exist');
            }

            return sharePost;
        } catch (error) {
            if (error instanceof BSONError) {
                throw new UnprocessableEntityException('SharePost ID Invalid ObjectId');
            }
            throw error;
        }
    }

    async isExistsCommentId(id: string) {
        try {
            const shareComment = await this.shareCommentRepository.findCommentIdWithReplyCountById(id);

            if (!shareComment) {
                throw new NotFoundException('Comment ID does not exist');
            }

            return shareComment;
        } catch (error) {
            const typedError = error as Error;
            if (typedError instanceof BSONError || typedError.name === 'CastError') {
                throw new UnprocessableEntityException('Comment Id Invalid ObjectId');
            }
            throw typedError;
        }
    }
}
