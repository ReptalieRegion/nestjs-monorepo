import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { Document, SchemaTypes, Types } from 'mongoose';
import { ReportDetailsType, ReportType } from '../dto/report/input-report.dto';
import { IResponseReportDTO } from '../dto/report/response-report.dto';
import { getCurrentDate } from '../utils/time/time';
import { User } from './user.schema';

export interface ReportDocument extends Report, Document {
    Mapper(): Partial<IResponseReportDTO>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class Report {
    @Prop({ index: true, ref: 'User', type: SchemaTypes.ObjectId })
    reporter: User;

    @Prop({ ref: 'User', type: SchemaTypes.ObjectId })
    reported: User;

    @Prop({ required: true, enum: ReportType })
    type: ReportType;

    @Prop({ required: true, type: SchemaTypes.ObjectId, refPath: 'type' })
    typeId: Types.ObjectId;

    @Prop({ required: true, enum: ReportDetailsType })
    details: ReportDetailsType;
}

const ReportSchema = SchemaFactory.createForClass(Report);
ReportSchema.index({ reporter: 1, type: 1 });
ReportSchema.methods = {
    Mapper(): Partial<IResponseReportDTO> {
        const fields: Array<keyof IResponseReportDTO> = [
            'id',
            'reporter',
            'reported',
            'type',
            'typeId',
            'details',
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

export { ReportSchema };
