import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { Document, SchemaTypes } from 'mongoose';
import { IResponseDiaryCalendarDTO } from '../dto/diary/calendar/response-diaryCalendar.dto';
import { DiaryEntityGenderType } from '../dto/diary/entity/input-diaryEntity.dto';
import { getCurrentDate } from '../utils/time/time';
import { DiaryEntity } from './diaryEntity.schema';
import { User } from './user.schema';

export interface DiaryCalendarDocument extends DiaryCalendar, Document {
    Mapper(): Partial<IResponseDiaryCalendarDTO>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class DiaryCalendar {
    @Prop({ index: true, ref: 'User', type: SchemaTypes.ObjectId })
    userId: User;

    @Prop({ ref: 'DiaryEntity', type: SchemaTypes.ObjectId })
    entityId: DiaryEntity;

    @Prop({ required: true, type: SchemaTypes.String })
    memo: string;

    @Prop({ required: true, type: [{ type: String, enum: DiaryEntityGenderType }] })
    markType: DiaryEntityGenderType[];

    @Prop({ required: true, type: SchemaTypes.Date })
    date: Date;

    @Prop({ default: false, type: SchemaTypes.Boolean })
    isDeleted: boolean;
}

const DiaryCalendarSchema = SchemaFactory.createForClass(DiaryCalendar);
DiaryCalendarSchema.index({ entityId: 1, userId: 1 });
DiaryCalendarSchema.methods = {
    Mapper(): Partial<IResponseDiaryCalendarDTO> {
        const fields: Array<keyof IResponseDiaryCalendarDTO> = [
            'id',
            'userId',
            'entityId',
            'memo',
            'markType',
            'date',
            'isDeleted',
            'createdAt',
            'updatedAt',
        ];

        const viewFields = fields.reduce((prev, field) => {
            const value = this.get(field);

            if (value === undefined) {
                return prev;
            }

            if (value instanceof mongoose.Types.ObjectId) {
                return {
                    ...prev,
                    [field]: value.toHexString(),
                };
            }
            return {
                ...prev,
                [field]: value,
            };
        }, {});
        return viewFields;
    },
};

export { DiaryCalendarSchema };
