import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DiaryEntity, DiaryEntityDocument } from '@private-crawl/models';
import mongoose, { ClientSession, Model } from 'mongoose';

import { InputDiaryEntityDTO } from '../../../dto/diary/entity/input-diaryEntity.dto';
import { BaseRepository } from '../../base/base.repository';

@Injectable()
export class DiaryEntityRepository extends BaseRepository<DiaryEntityDocument> {
    constructor(@InjectModel(DiaryEntity.name) private readonly diaryEntityModel: Model<DiaryEntityDocument>) {
        super(diaryEntityModel);
    }

    async createEntity(entityInfo: InputDiaryEntityDTO, session: ClientSession) {
        const entity = new this.diaryEntityModel(entityInfo);
        const savedEntity = await entity.save({ session });
        return savedEntity.Mapper();
    }

    async withdrawalEntity(query: mongoose.FilterQuery<DiaryEntityDocument>, session: ClientSession) {
        await this.diaryEntityModel.updateMany(query, { $set: { isDeleted: true } }, { session }).exec();
    }

    async restoreEntity(oldUserId: string, newUserId: string, session: ClientSession) {
        await this.diaryEntityModel
            .updateMany({ userId: oldUserId, isDeleted: true }, { $set: { userId: newUserId, isDeleted: false } }, { session })
            .exec();
    }
}
