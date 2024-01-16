import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { Document, SchemaTypes } from 'mongoose';
import { IResponseReportBlockingDTO } from '../dto/report/blocking/response-reportUserBlocking.dto';
import { getCurrentDate } from '../utils/time/time';
import { User } from './user.schema';

export interface ReportUserBlockingDocument extends ReportUserBlocking, Document {
    Mapper(): Partial<IResponseReportBlockingDTO>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class ReportUserBlocking {
    @Prop({ index: true, ref: 'User', type: SchemaTypes.ObjectId })
    blocker: User;

    @Prop({ index: true, ref: 'User', type: SchemaTypes.ObjectId })
    blocked: User;

    @Prop({ default: false, type: SchemaTypes.Boolean })
    isDeleted: boolean;
}

const ReportUserBlockingSchema = SchemaFactory.createForClass(ReportUserBlocking);
ReportUserBlockingSchema.methods = {
    Mapper(): Partial<IResponseReportBlockingDTO> {
        const fields: Array<keyof IResponseReportBlockingDTO> = [
            'id',
            'blocker',
            'blocked',
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

export { ReportUserBlockingSchema };
