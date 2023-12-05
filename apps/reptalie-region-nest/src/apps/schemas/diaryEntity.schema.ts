import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { Document, SchemaTypes } from 'mongoose';
import { BasicVariety, DiaryEntityGenderType, DiaryEntityWeightType } from '../dto/diary/entity/input-diaryEntity.dto';
import { IResponseDiaryEntityDTO } from '../dto/diary/entity/response-diaryEntity.dto';
import { getCurrentDate } from '../utils/time/time';
import { Image } from './image.schema';
import { User } from './user.schema';

export interface DiaryEntityDocument extends DiaryEntity, Document {
    Mapper(): Partial<IResponseDiaryEntityDTO>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class DiaryEntity {
    @Prop({ index: true, ref: 'User', type: SchemaTypes.ObjectId })
    userId: User;

    @Prop({ ref: 'Image', required: true, type: SchemaTypes.ObjectId })
    imageId: Image;

    @Prop({ required: true, type: SchemaTypes.String })
    name: string;

    @Prop({ required: true, enum: DiaryEntityGenderType })
    gender: DiaryEntityGenderType;

    @Prop({ required: true, type: SchemaTypes.Mixed })
    variety: BasicVariety;

    @Prop({ type: SchemaTypes.Date })
    hatching: Date;

    @Prop({ required: true, enum: DiaryEntityWeightType })
    weightUnit: DiaryEntityWeightType;

    @Prop({ default: false, type: SchemaTypes.Boolean })
    isDeleted: boolean;
}

const DiaryEntitySchema = SchemaFactory.createForClass(DiaryEntity);
DiaryEntitySchema.methods = {
    Mapper(): Partial<IResponseDiaryEntityDTO> {
        const fields: Array<keyof IResponseDiaryEntityDTO> = [
            'id',
            'userId',
            'imageId',
            'name',
            'gender',
            'variety',
            'hatching',
            'weightUnit',
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

export { DiaryEntitySchema };
