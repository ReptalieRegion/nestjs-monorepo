import { SchemaId } from '../common/id';

interface INotificationAgree {
    _id: SchemaId;
    id: string;
    userId: SchemaId;
    device: boolean;
    comment: boolean;
    like: boolean;
    follow: boolean;
    tag: boolean;
    service: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type { INotificationAgree };
