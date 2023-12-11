import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { InputDiaryCalendarDTO } from '../../../dto/diary/calendar/input-diaryCalendar.dto';
import { DiaryCalendar, DiaryCalendarDocument } from '../../../schemas/diaryCalendar.schema';
import { BaseRepository } from '../../base/base.repository';

@Injectable()
export class DiaryCalendarRepository extends BaseRepository<DiaryCalendarDocument> {
    constructor(@InjectModel(DiaryCalendar.name) private readonly diaryCalendarModel: Model<DiaryCalendarDocument>) {
        super(diaryCalendarModel);
    }

    async createCalendar(calendarInfo: InputDiaryCalendarDTO) {
        const calendar = new this.diaryCalendarModel(calendarInfo);
        const savedCalendar = await calendar.save();
        return savedCalendar.Mapper();
    }
}
