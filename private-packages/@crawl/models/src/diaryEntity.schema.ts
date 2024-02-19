import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { DiaryEntityGenderType, DiaryEntityWeightType, IBasicVariety, IDiaryEntity } from '@private-crawl/types';
import { getCurrentDate } from '@private-crawl/utils';
import { Document, SchemaTypes } from 'mongoose';
import { Image } from './image.schema';
import { User } from './user.schema';
import { getViewFields } from './utils/getViewFields';

export interface DiaryEntityDocument extends DiaryEntity, Document {
    Mapper(): Omit<IDiaryEntity, '_id'>;
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
    variety: IBasicVariety;

    @Prop({ type: SchemaTypes.Date })
    hatching: Date;

    @Prop({ required: true, enum: DiaryEntityWeightType })
    weightUnit: DiaryEntityWeightType;

    @Prop({ default: false, type: SchemaTypes.Boolean })
    isDeleted: boolean;
}

const DiaryEntitySchema = SchemaFactory.createForClass(DiaryEntity);
DiaryEntitySchema.methods = {
    Mapper() {
        return getViewFields<Omit<IDiaryEntity, '_id'>>(this, [
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
        ]);
    },
};

export { DiaryEntitySchema };
