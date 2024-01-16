import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { Document, SchemaTypes, Types } from 'mongoose';
import { ReportShareContentDetailsType, ReportShareContentType } from '../dto/report/share/input-reportShareContent.dto';
import { IResponseReportShareContentDTO } from '../dto/report/share/response-reportShareContent.dto';
import { getCurrentDate } from '../utils/time/time';
import { User } from './user.schema';

export interface ReportShareContentDocument extends ReportShareContent, Document {
    Mapper(): Partial<IResponseReportShareContentDTO>;
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
    Mapper(): Partial<IResponseReportShareContentDTO> {
        const fields: Array<keyof IResponseReportShareContentDTO> = [
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

export { ReportShareContentSchema };
