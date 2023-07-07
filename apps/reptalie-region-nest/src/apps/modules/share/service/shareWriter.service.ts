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

        let imageKey: string[] | undefined;

        try {
            const sharePost = await this.sharePostRepository.createSharePost(inputSharePostDTO, session);

            if (!sharePost || !sharePost.id) {
                throw new Error('Failed to create share post');
            }

            imageKey = await this.imageToS3Service.uploadToS3(files);

            // throw new Error('테스트 에러');

            await session.commitTransaction();
        } catch (error) {
            console.log(error);
            console.log(imageKey);

            await session.abortTransaction();
        } finally {
            console.log('finally');
            await session.endSession();
        }
    }
}
