import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { DiaryCalendarMarkType, IDiaryCalendar } from '@private-crawl/types';
import { getCurrentDate } from '@private-crawl/utils';
import { Document, SchemaTypes } from 'mongoose';
import { DiaryEntity } from './diaryEntity.schema';
import { User } from './user.schema';
import { getViewFields } from './utils/getViewFields';

export interface DiaryCalendarDocument extends DiaryCalendar, Document {
    Mapper(): Omit<IDiaryCalendar, '_id'>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class DiaryCalendar {
    @Prop({ index: true, ref: 'User', type: SchemaTypes.ObjectId })
    userId: User;

    @Prop({ ref: 'DiaryEntity', type: SchemaTypes.ObjectId })
    entityId: DiaryEntity;

    @Prop({ default: '', type: SchemaTypes.String })
    memo: string;

    @Prop({ required: true, type: [{ type: String, enum: DiaryCalendarMarkType }] })
    markType: DiaryCalendarMarkType[];

    @Prop({ required: true, type: SchemaTypes.Date })
    date: Date;

    @Prop({ default: false, type: SchemaTypes.Boolean })
    isDeleted: boolean;
}

const DiaryCalendarSchema = SchemaFactory.createForClass(DiaryCalendar);
DiaryCalendarSchema.index({ date: 1, userId: 1 });
DiaryCalendarSchema.methods = {
    Mapper() {
        return getViewFields<Omit<IDiaryCalendar, '_id'>>(this, [
            'id',
            'userId',
            'entityId',
            'memo',
            'markType',
            'date',
            'isDeleted',
            'createdAt',
            'updatedAt',
        ]);
    },
};

export { DiaryCalendarSchema };
