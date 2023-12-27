import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { Document, SchemaTypes } from 'mongoose';
import { IResponseMetaDataDTO } from '../dto/metaData/response-metaData.dto';
import { getCurrentDate } from '../utils/time/time';

export interface MetaDataDocument extends MetaData, Document {
    Mapper(): Partial<IResponseMetaDataDTO>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class MetaData {
    @Prop({ required: true, type: SchemaTypes.String, unique: true })
    name: string;

    @Prop({ required: true, type: SchemaTypes.String })
    values: string;
}

const MetaDataSchema = SchemaFactory.createForClass(MetaData);
MetaDataSchema.methods = {
    Mapper(): Partial<IResponseMetaDataDTO> {
        const fields: Array<keyof IResponseMetaDataDTO> = ['id', 'name', 'values', 'createdAt', 'updatedAt'];

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

export { MetaDataSchema };
