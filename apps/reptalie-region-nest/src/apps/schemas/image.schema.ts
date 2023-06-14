import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, SchemaTypes, Types } from 'mongoose';
import { ImageType } from '../dto/image/input-image.dto';
import { IResponseImageDTO } from '../dto/image/response-image.dto';

export interface ImageDocument extends Image, Document {
    view(): Partial<IResponseImageDTO>;
}

@Schema({ versionKey: false })
export class Image {
    @Prop({ required: true, type: [SchemaTypes.String] })
    imageKey: string[];

    @Prop({ required: true, enum: ImageType })
    type: ImageType;

    @Prop({ required: true, type: SchemaTypes.ObjectId, refPath: 'type' })
    typeId: Types.ObjectId;

    @Prop({ default: false, type: SchemaTypes.Boolean })
    isDeleted: boolean;
}

const ImageSchema = SchemaFactory.createForClass(Image);
ImageSchema.set('timestamps', true);
ImageSchema.index({ type: 1, typeId: 1 });
ImageSchema.methods = {
    view(): Partial<IResponseImageDTO> {
        const fields: Array<keyof IResponseImageDTO> = ['id', 'imageKey', 'type', 'typeId'];

        const viewFields = fields.reduce(
            (prev, field) => ({
                ...prev,
                [field]: this.get(field),
            }),
            {},
        );

        return viewFields;
    },
};

export { ImageSchema };
