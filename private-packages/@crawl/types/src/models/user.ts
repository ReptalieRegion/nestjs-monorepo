import { SchemaId } from '../common/id';

interface IDeviceInfo {
    version: string;
    buildNumber: string;
    systemName: string;
    systemVersion: string;
}

interface IUser {
    _id: SchemaId;
    id: string;
    nickname: string;
    initials: string;
    name: string;
    phone: string;
    address: string;
    fcmToken: string;
    deviceInfo?: IDeviceInfo;
    lastAccessAt?: Date;
    imageId: SchemaId;
    createdAt: Date;
    updatedAt: Date;
}

export type { IUser, IDeviceInfo };
