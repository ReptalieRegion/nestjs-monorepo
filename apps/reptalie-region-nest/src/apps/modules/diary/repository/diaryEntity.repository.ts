import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { DiaryEntity, DiaryEntityDocument } from '../../../schemas/diaryEntity.schema';
import { BaseRepository } from '../../base/base.repository';

@Injectable()
export class DiaryEntityRepository extends BaseRepository<DiaryEntityDocument> {
    constructor(@InjectModel(DiaryEntity.name) private readonly diaryEntityModel: Model<DiaryEntityDocument>) {
        super(diaryEntityModel);
    }
}
