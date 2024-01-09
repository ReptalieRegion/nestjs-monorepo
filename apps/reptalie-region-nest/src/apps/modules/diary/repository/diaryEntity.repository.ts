import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { ClientSession, Model } from 'mongoose';

import { InputDiaryEntityDTO } from '../../../dto/diary/entity/input-diaryEntity.dto';
import { DiaryEntity, DiaryEntityDocument } from '../../../schemas/diaryEntity.schema';
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

    async deleteEntity(query: mongoose.FilterQuery<DiaryEntityDocument>, session: ClientSession) {
        await this.diaryEntityModel.updateMany(query, { $set: { isDeleted: true } }, { session }).exec();
    }
}
