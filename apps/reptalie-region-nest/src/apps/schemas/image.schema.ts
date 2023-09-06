import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { Document, SchemaTypes, Types } from 'mongoose';
import { ImageType } from '../dto/image/input-image.dto';
import { IResponseImageDTO } from '../dto/image/response-image.dto';
import { getCurrentDate } from '../utils/time/time';

export interface ImageDocument extends Image, Document {
    view(): Partial<IResponseImageDTO>;
    Mapper(): Partial<IResponseImageDTO>;
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
    view(): Partial<IResponseImageDTO> {
        const fields: Array<keyof IResponseImageDTO> = [
            'id',
            'imageKey',
            'type',
            'typeId',
            'isDeleted',
            'createdAt',
            'updatedAt',
        ];

        const viewFields = fields.reduce(
            (prev, field) => ({
                ...prev,
                [field]: this.get(field),
            }),
            {},
        );

        return viewFields;
    },

    Mapper(): Partial<IResponseImageDTO> {
        const fields: Array<keyof IResponseImageDTO> = [
            'id',
            'imageKey',
            'type',
            'typeId',
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

export { ImageSchema };
