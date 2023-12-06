import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

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
}
