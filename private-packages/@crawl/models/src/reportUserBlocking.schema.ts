import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IReportUserBlocking } from '@private-crawl/types';
import { getCurrentDate } from '@private-crawl/utils';
import { Document, SchemaTypes } from 'mongoose';

import { User } from './user.schema';
import { getViewFields } from './utils/getViewFields';

export interface ReportUserBlockingDocument extends ReportUserBlocking, Document {
    Mapper(): IReportUserBlocking;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class ReportUserBlocking {
    @Prop({ index: true, ref: 'User', type: SchemaTypes.ObjectId })
    blocker: User;

    @Prop({ index: true, ref: 'User', type: SchemaTypes.ObjectId })
    blocked: User;
}

const ReportUserBlockingSchema = SchemaFactory.createForClass(ReportUserBlocking);
ReportUserBlockingSchema.methods = {
    Mapper() {
        return getViewFields<IReportUserBlocking>(this, ['id', 'blocker', 'blocked', 'createdAt', 'updatedAt']);
    },
};

export { ReportUserBlockingSchema };
