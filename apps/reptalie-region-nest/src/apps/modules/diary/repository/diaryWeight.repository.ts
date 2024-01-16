import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { ClientSession, Model } from 'mongoose';

import { InputDiaryWeightDTO } from '../../../dto/diary/weight/input-diaryWeight.dto';
import { DiaryWeight, DiaryWeightDocument } from '../../../schemas/diaryWeight.schema';
import { BaseRepository } from '../../base/base.repository';

@Injectable()
export class DiaryWeightRepository extends BaseRepository<DiaryWeightDocument> {
    constructor(@InjectModel(DiaryWeight.name) private readonly diaryWeightModel: Model<DiaryWeightDocument>) {
        super(diaryWeightModel);
    }

    async createWeight(weightInfo: InputDiaryWeightDTO) {
        const weight = new this.diaryWeightModel(weightInfo);
        const savedWeight = await weight.save();
        return savedWeight.Mapper();
    }

    async withdrawalWeight(query: mongoose.FilterQuery<DiaryWeightDocument>, session: ClientSession) {
        await this.diaryWeightModel.updateMany(query, { $set: { isDeleted: true } }, { session }).exec();
    }

    async restoreWeight(entityIds: string[], session: ClientSession) {
        await this.diaryWeightModel
            .updateMany({ entityId: { $in: entityIds }, isDeleted: true }, { $set: { isDeleted: false } }, { session })
            .exec();
    }
}
