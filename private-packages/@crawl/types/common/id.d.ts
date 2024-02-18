import { Schema } from 'mongoose';

export namespace SchemaId {
    export type Id = string | Schema.Types.ObjectId;
}
