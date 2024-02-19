import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IImage, ImageType } from '@private-crawl/types';
import { getCurrentDate } from '@private-crawl/utils';
import { Document, SchemaTypes, Types } from 'mongoose';
import { getViewFields } from './utils/getViewFields';

export interface ImageDocument extends Image, Document {
    Mapper(): Omit<IImage, '_id'>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class Image {
    @Prop({ required: true, type: SchemaTypes.String })
    imageKey: string;

    @Prop({ required: true, enum: ImageType })
    type: ImageType;

    @Prop({ required: true, type: SchemaTypes.ObjectId, refPath: 'type' })
    typeId: Types.ObjectId;

    @Prop({ default: false, type: SchemaTypes.Boolean })
    isDeleted: boolean;
}

const ImageSchema = SchemaFactory.createForClass(Image);
ImageSchema.index({ type: 1, typeId: 1 });
ImageSchema.index({ imageKey: 1, typeId: 1 });
ImageSchema.methods = {
    Mapper() {
        return getViewFields<Omit<IImage, '_id'>>(this, [
            'id',
            'imageKey',
            'type',
            'typeId',
            'isDeleted',
            'createdAt',
            'updatedAt',
        ]);
    },
};

export { ImageSchema };
