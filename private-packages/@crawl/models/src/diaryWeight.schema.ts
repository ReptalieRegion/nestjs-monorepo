import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IDiaryWeight } from '@private-crawl/types';
import { getCurrentDate } from '@private-crawl/utils';
import { Document, SchemaTypes } from 'mongoose';
import { DiaryEntity } from './diaryEntity.schema';
import { getViewFields } from './utils/getViewFields';

export interface DiaryWeightDocument extends DiaryWeight, Document {
    Mapper(): Omit<IDiaryWeight, '_id'>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class DiaryWeight {
    @Prop({ index: true, ref: 'DiaryEntity', type: SchemaTypes.ObjectId })
    entityId: DiaryEntity;

    @Prop({ required: true, type: SchemaTypes.Date })
    date: Date;

    @Prop({ required: true, type: SchemaTypes.Number })
    weight: number;

    @Prop({ default: false, type: SchemaTypes.Boolean })
    isDeleted: boolean;
}

const DiaryWeightSchema = SchemaFactory.createForClass(DiaryWeight);
DiaryWeightSchema.index({ entityId: 1, date: 1 }, { unique: true });
DiaryWeightSchema.methods = {
    Mapper() {
        return getViewFields<Omit<IDiaryWeight, '_id'>>(this, [
            'id',
            'entityId',
            'date',
            'weight',
            'isDeleted',
            'createdAt',
            'updatedAt',
        ]);
    },
};

export { DiaryWeightSchema };
