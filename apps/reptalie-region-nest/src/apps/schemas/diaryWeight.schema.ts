import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { Document, SchemaTypes } from 'mongoose';
import { IResponseDiaryWeightDTO } from '../dto/diary/weight/response-diaryWeight.dto';
import { getCurrentDate } from '../utils/time/time';
import { DiaryEntity } from './diaryEntity.schema';

export interface DiaryWeightDocument extends DiaryWeight, Document {
    Mapper(): Partial<IResponseDiaryWeightDTO>;
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
    Mapper(): Partial<IResponseDiaryWeightDTO> {
        const fields: Array<keyof IResponseDiaryWeightDTO> = [
            'id',
            'entityId',
            'date',
            'weight',
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

export { DiaryWeightSchema };
