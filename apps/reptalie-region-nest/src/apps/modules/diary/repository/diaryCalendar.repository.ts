import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { DiaryCalendar, DiaryCalendarDocument } from '../../../schemas/diaryCalendar.schema';
import { BaseRepository } from '../../base/base.repository';

@Injectable()
export class DiaryCalendarRepository extends BaseRepository<DiaryCalendarDocument> {
    constructor(@InjectModel(DiaryCalendar.name) private readonly diaryCalendarModel: Model<DiaryCalendarDocument>) {
        super(diaryCalendarModel);
    }
}
