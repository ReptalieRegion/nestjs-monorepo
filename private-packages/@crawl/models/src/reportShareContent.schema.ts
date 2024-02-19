import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IReportShareContent, ReportShareContentDetailsType, ReportShareContentType } from '@private-crawl/types';
import { getCurrentDate } from '@private-crawl/utils';
import { Document, SchemaTypes, Types } from 'mongoose';

import { User } from './user.schema';
import { getViewFields } from './utils/getViewFields';

export interface ReportShareContentDocument extends ReportShareContent, Document {
    Mapper(): Omit<IReportShareContent, '_id'>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class ReportShareContent {
    @Prop({ index: true, ref: 'User', type: SchemaTypes.ObjectId })
    reporter: User;

    @Prop({ index: true, ref: 'User', type: SchemaTypes.ObjectId })
    reported: User;

    @Prop({ required: true, enum: ReportShareContentType })
    type: ReportShareContentType;

    @Prop({ required: true, type: SchemaTypes.ObjectId, refPath: 'type' })
    typeId: Types.ObjectId;

    @Prop({ required: true, enum: ReportShareContentDetailsType })
    details: ReportShareContentDetailsType;
}

const ReportShareContentSchema = SchemaFactory.createForClass(ReportShareContent);
ReportShareContentSchema.index({ reporter: 1, type: 1 });
ReportShareContentSchema.index({ reporter: 1, typeId: 1 }, { unique: true });
ReportShareContentSchema.methods = {
    Mapper() {
        return getViewFields<IReportShareContent>(this, [
            'id',
            'reporter',
            'reported',
            'type',
            'typeId',
            'details',
            'createdAt',
            'updatedAt',
        ]);
    },
};

export { ReportShareContentSchema };
