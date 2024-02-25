import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IUserActivityLog, SchemaId, UserActivityType } from '@private-crawl/types';
import { Document, SchemaTypes } from 'mongoose';

import { getViewFields } from './utils/getViewFields';

export interface UserDocument extends UserActivityLog, Document {
    Mapper(): IUserActivityLog;
}

@Schema({ versionKey: false, timestamps: { createdAt: true } })
export class UserActivityLog {
    @Prop({ index: true, unique: true, type: SchemaTypes.String })
    userId: SchemaId;

    @Prop({ index: true, required: true, enum: UserActivityType })
    activityType: UserActivityType;

    @Prop({ type: SchemaTypes.String })
    details?: string;
}

const userSchema = SchemaFactory.createForClass(UserActivityLog);
userSchema.index({ createdAt: 1 });
userSchema.methods = {
    Mapper() {
        return getViewFields<Omit<IUserActivityLog, '_id'>>(this, ['id', 'userId', 'activityType', 'details']);
    },
};

export { userSchema };
