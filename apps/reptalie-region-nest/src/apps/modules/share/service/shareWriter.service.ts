import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { InputSharePostDTO } from '../../../dto/sharePost/input-sharePost.dto';
import { ImageToS3ServiceToken, ImageToS3Service } from '../../image/imageToS3.service';
import { ImageToTableServiceToken, ImageToTableService } from '../../image/imageToTable.service';

import { UserSearcherService, UserSearcherServiceToken } from '../../user/service/userSearcher.service';
import { SharePostRepository } from '../repository/sharePost.repository';

export const ShareWriterServiceToken = 'ShareWriterServiceToken';

@Injectable()
export class ShareWriterService {
    constructor(
        private readonly sharePostRepository: SharePostRepository,

        @Inject(UserSearcherServiceToken)
        private readonly userSearcherService: UserSearcherService,
        @Inject(ImageToS3ServiceToken)
        private readonly imageToS3Service: ImageToS3Service,
        @Inject(ImageToTableServiceToken)
        private readonly imageToTableService: ImageToTableService,
    ) {}

    async createSharePostWithImages(inputSharePostDTO: InputSharePostDTO, files: Express.Multer.File[]) {
        const session: ClientSession = await this.sharePostRepository.startSession();
        session.startTransaction();

        const isIdExists = await this.userSearcherService.userIdExists(inputSharePostDTO.userId);

        if (!isIdExists) {
            throw new BadRequestException('User ID does not exist');
        }

        let imageKeys: string[] = [];

        try {
            const sharePost = await this.sharePostRepository.createSharePost(inputSharePostDTO, session);

            if (!sharePost || !sharePost.id) {
                throw new Error('Failed to create share post');
            }

            imageKeys = await this.imageToS3Service.uploadToS3(files);

            await this.imageToTableService.createImageFromShare(sharePost.id, imageKeys, session);

            await session.commitTransaction();
        } catch (error) {
            if (imageKeys.length !== 0) {
                await this.imageToS3Service.deleteImagesFromS3(imageKeys);
            }
            await session.abortTransaction();
            
            throw error;
        } finally {
            await session.endSession();
        }
    }
}
