import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { Document, SchemaTypes, Types } from 'mongoose';
import { TagType } from '../dto/tag/input-tag.dto';
import { IResponseTagDTO } from '../dto/tag/response-tag.dto';
import { getCurrentDate } from '../utils/time/time';
import { User } from './user.schema';

export interface TagDocument extends Tag, Document {
    view(): Partial<IResponseTagDTO>;
    Mapper(): Partial<IResponseTagDTO>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class Tag {
    @Prop({ required: true, enum: TagType })
    type: TagType;

    @Prop({ required: true, type: SchemaTypes.ObjectId, refPath: 'type' })
    typeId: Types.ObjectId;

    @Prop({ index: true, ref: 'user', type: SchemaTypes.ObjectId })
    tagIds: User;

    @Prop({ default: false, type: SchemaTypes.Boolean })
    isDeleted: boolean;
}

const TagSchema = SchemaFactory.createForClass(Tag);
TagSchema.index({ type: 1, typeId: 1 });
TagSchema.methods = {
    view(): Partial<IResponseTagDTO> {
        const fields: Array<keyof IResponseTagDTO> = [
            'id',
            'type',
            'typeId',
            'tagIds',
            'isDeleted',
            'createdAt',
            'updatedAt',
        ];

        const viewFields = fields.reduce(
            (prev, field) => ({
                ...prev,
                [field]: this.get(field),
            }),
            {},
        );

        return viewFields;
    },

    Mapper(): Partial<IResponseTagDTO> {
        const fields: Array<keyof IResponseTagDTO> = [
            'id',
            'type',
            'typeId',
            'tagIds',
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

export { TagSchema };
