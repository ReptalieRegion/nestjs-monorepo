import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { ClientSession } from 'mongoose';
import { IUpdateCalendarDTO } from '../../../dto/diary/calendar/input-diaryCalendar.dto';
import { IUpdateEntityDTO } from '../../../dto/diary/entity/input-diaryEntity.dto';
import { IUpdateWeightDTO } from '../../../dto/diary/weight/input-diaryWeight.dto';
import { ImageType } from '../../../dto/image/input-image.dto';
import { IUserProfileDTO } from '../../../dto/user/user/response-user.dto';
import { serviceErrorHandler } from '../../../utils/error/errorHandler';
import { ImageDeleterService, ImageDeleterServiceToken } from '../../image/service/imageDeleter.service';
import { ImageS3HandlerService, ImageS3HandlerServiceToken } from '../../image/service/imageS3Handler.service';
import { ImageWriterService, ImageWriterServiceToken } from '../../image/service/imageWriter.service';
import { DiaryCalendarRepository } from '../repository/diaryCalendar.repository';
import { DiaryEntityRepository } from '../repository/diaryEntity.repository';
import { DiaryWeightRepository } from '../repository/diaryWeight.repository';

export const DiaryUpdaterServiceToken = 'DiaryUpdaterServiceToken';

@Injectable()
export class DiaryUpdaterService {
    constructor(
        @InjectConnection()
        private readonly connection: mongoose.Connection,

        private readonly diaryEntityRepository: DiaryEntityRepository,
        private readonly diaryWeightRepository: DiaryWeightRepository,
        private readonly diaryCalendarRepository: DiaryCalendarRepository,

        @Inject(ImageS3HandlerServiceToken)
        private readonly imageS3HandlerService: ImageS3HandlerService,
        @Inject(ImageWriterServiceToken)
        private readonly imageWriterService: ImageWriterService,
        @Inject(ImageDeleterServiceToken)
        private readonly imageDeleterService: ImageDeleterService,
    ) {}

    async updateEntity(user: IUserProfileDTO, entityId: string, dto: IUpdateEntityDTO, files?: Express.Multer.File[]) {
        const session: ClientSession = await this.connection.startSession();
        session.startTransaction();

        let imageKeys: string[] = [];

        try {
            if (files?.length) {
                await this.imageDeleterService.deleteImageByTypeId(ImageType.Diary, entityId, session);

                imageKeys = await this.imageS3HandlerService.uploadToS3(files);
                const [image] = await this.imageWriterService.createImage(entityId, imageKeys, ImageType.Diary, session);
                dto = { ...dto, imageId: image.id as string };
            }

            const result = await this.diaryEntityRepository
                .updateOne({ _id: entityId, userId: user.id, isDeleted: false }, { $set: { ...dto } }, { session })
                .exec();

            if (result.modifiedCount === 0) {
                throw new InternalServerErrorException('Failed to update diary entity.');
            }

            await session.commitTransaction();

            return { message: 'Success' };
        } catch (error) {
            await this.imageS3HandlerService.deleteImagesFromS3(imageKeys);
            await session.abortTransaction();
            serviceErrorHandler(error, 'Invalid ObjectId for diary entity Id.');
        } finally {
            await session.endSession();
        }
    }

    async updateWeight(entityId: string, dto: IUpdateWeightDTO) {
        try {
            const result = await this.diaryWeightRepository
                .updateOne({ entityId, date: dto.date, isDeleted: false }, { $set: { weight: dto.weight } })
                .exec();

            if (result.modifiedCount === 0) {
                throw new InternalServerErrorException('Failed to update diary weight.');
            }

            return { message: 'Success' };
        } catch (error) {
            serviceErrorHandler(error, 'Invalid ObjectId for diary entity Id.');
        }
    }

    async updateCalendar(calendarId: string, dto: IUpdateCalendarDTO) {
        try {
            const result = await this.diaryCalendarRepository
                .updateOne({ _id: calendarId, isDeleted: false }, { $set: { ...dto } })
                .exec();

            if (result.modifiedCount === 0) {
                throw new InternalServerErrorException('Failed to update diary calendar.');
            }

            return { message: 'Success' };
        } catch (error) {
            serviceErrorHandler(error, 'Invalid ObjectId for diary calendar Id.');
        }
    }

    /**
     * 다이어리의 이미지 ID를 업데이트합니다.
     *
     * @param _id - 사용자 ID
     * @param imageId - 새로운 이미지 ID
     * @param session - MongoDB 클라이언트 세션
     */
    async updateImageId(_id: string, imageId: string, session: ClientSession) {
        const result = await this.diaryEntityRepository.updateOne({ _id }, { $set: { imageId } }, { session }).exec();

        if (result.modifiedCount === 0) {
            throw new InternalServerErrorException('Failed to update image Id.');
        }
    }
}
