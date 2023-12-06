import { HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { ClientSession } from 'mongoose';
import { InputDiaryEntityDTO } from '../../../dto/diary/entity/input-diaryEntity.dto';
import { InputDiaryWeightDTO } from '../../../dto/diary/weight/input-diaryWeight.dto';
import { ImageType } from '../../../dto/image/input-image.dto';
import { IUserProfileDTO } from '../../../dto/user/user/response-user.dto';
import { serviceErrorHandler } from '../../../utils/error/errorHandler';
import { ImageS3HandlerService, ImageS3HandlerServiceToken } from '../../image/service/imageS3Handler.service';
import { ImageWriterService, ImageWriterServiceToken } from '../../image/service/imageWriter.service';
import { NotificationSlackService, NotificationSlackServiceToken } from '../../notification/service/notificationSlack.service';
import { DiaryEntityRepository } from '../repository/diaryEntity.repository';
import { DiaryWeightRepository } from '../repository/diaryWeight.repository';
import { DiaryUpdaterService, DiaryUpdaterServiceToken } from './diaryUpdater.service';

export const DiaryWriterServiceToken = 'DiaryWriterServiceToken';

@Injectable()
export class DiaryWriterService {
    constructor(
        @InjectConnection()
        private readonly connection: mongoose.Connection,

        private readonly diaryEntityRepository: DiaryEntityRepository,
        private readonly diaryWeightRepository: DiaryWeightRepository,

        @Inject(ImageS3HandlerServiceToken)
        private readonly imageS3HandlerService: ImageS3HandlerService,
        @Inject(ImageWriterServiceToken)
        private readonly imageWriterService: ImageWriterService,

        @Inject(DiaryUpdaterServiceToken)
        private readonly diaryUpdaterService: DiaryUpdaterService,
        @Inject(NotificationSlackServiceToken)
        private readonly notificationSlackService: NotificationSlackService,
    ) {}

    /**
     * 새로운 엔터티를 생성하고 연관된 이미지를 추가합니다.
     *
     * @param user - 엔터티를 생성하는 사용자.
     * @param files - 엔터티에 연결할 파일(이미지)의 배열.
     * @param dto - 엔터티를 생성하는 데 사용되는 입력 DTO.
     * @returns 생성된 엔터티를 반환합니다.
     */
    async createEntity(user: IUserProfileDTO, files: Express.Multer.File[], dto: InputDiaryEntityDTO) {
        const session: ClientSession = await this.connection.startSession();
        session.startTransaction();

        let imageKeys: string[] = [];

        try {
            const entity = await this.diaryEntityRepository.createEntity(
                {
                    ...dto,
                    userId: user.id,
                    imageId: String(new mongoose.Types.ObjectId()),
                },
                session,
            );

            if (!entity) {
                throw new InternalServerErrorException('Failed to save diary entity.');
            }

            imageKeys = await this.imageS3HandlerService.uploadToS3(files);
            const [image] = await this.imageWriterService.createImage(entity.id as string, imageKeys, ImageType.Diary, session);
            await this.diaryUpdaterService.updateImageId(entity.id as string, image.id as string, session);

            await session.commitTransaction();

            return entity;
        } catch (error) {
            const caughtError = error as Error;
            this.notificationSlackService.send(`*[푸시 알림]* 개체 생성 실패\n${caughtError.message}`, '푸시알림-에러-dev');

            await this.imageS3HandlerService.deleteImagesFromS3(imageKeys);
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
    }

    async createWeight(user: IUserProfileDTO, entityId: string, dto: InputDiaryWeightDTO) {
        try {
            const isExistsEntity = await this.diaryEntityRepository
                .findOne({ _id: entityId, userId: user.id, isDeleted: false })
                .exec();

            if (!isExistsEntity) {
                throw new NotFoundException('Not found for the specified diary entity.');
            }

            try {
                const weight = await this.diaryWeightRepository.createWeight({ ...dto, entityId });

                if (!weight) {
                    throw new InternalServerErrorException('Failed to save diary weight.');
                }
            } catch (error) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.EXPECTATION_FAILED,
                        message: 'diaryId and date should be unique values.',
                        error: 'Expectation Failed',
                    },
                    HttpStatus.EXPECTATION_FAILED,
                );
            }

            return { message: 'Success' };
        } catch (error) {
            serviceErrorHandler(error, 'Invalid ObjectId for diary entity Id.');
        }
    }
}
