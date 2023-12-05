import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { DiaryWeight, DiaryWeightDocument } from '../../../schemas/diaryWeight.schema';
import { BaseRepository } from '../../base/base.repository';

@Injectable()
export class DiaryWeightRepository extends BaseRepository<DiaryWeightDocument> {
    constructor(@InjectModel(DiaryWeight.name) private readonly diaryWeightModel: Model<DiaryWeightDocument>) {
        super(diaryWeightModel);
    }
}
