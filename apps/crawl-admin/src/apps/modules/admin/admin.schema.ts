import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { getCurrentDate } from '@private-crawl/utils';
import { Document, SchemaTypes } from 'mongoose';
import { ROLE } from '../../types/enums/admin.enum';
import { OTP } from '../../types/models/admin.model';

export interface AdminDocument extends Admin, Document {
    createdAt: Date;
    updatedAt: Date;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class Admin {
    @Prop({ required: true, type: SchemaTypes.String, unique: true, index: true })
    email: string;

    @Prop({ required: true, type: SchemaTypes.String, index: true })
    name: string;

    @Prop({ required: true, type: SchemaTypes.String })
    password: string;

    @Prop({ required: true, type: SchemaTypes.String })
    salt: string;

    @Prop({ type: SchemaTypes.String })
    refreshToken: string;

    @Prop({ type: SchemaTypes.Mixed })
    otp: OTP;

    @Prop({ required: true, enum: ROLE })
    role: ROLE;

    @Prop({ required: true, type: SchemaTypes.Date })
    lastAccessedAt: Date;
}

const adminSchema = SchemaFactory.createForClass(Admin);

export { adminSchema };
