import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IMetaData } from '@private-crawl/types';
import { getCurrentDate } from '@private-crawl/utils';

import { Document, SchemaTypes } from 'mongoose';
import { getViewFields } from './utils/getViewFields';

export interface MetaDataDocument extends MetaData, Document {
    Mapper(): Omit<IMetaData, '_id'>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class MetaData {
    @Prop({ required: true, type: SchemaTypes.String, unique: true })
    name: string;

    @Prop({ required: true, type: SchemaTypes.Map })
    data: Map<string, unknown>;
}

const MetaDataSchema = SchemaFactory.createForClass(MetaData);
MetaDataSchema.methods = {
    Mapper() {
        return getViewFields<Omit<IMetaData, '_id'>>(this, ['id', 'name', 'data', 'createdAt', 'updatedAt']);
    },
};

export { MetaDataSchema };
