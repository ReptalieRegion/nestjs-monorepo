interface IDeviceInfo {
    version: string;
    buildNumber: string;
    systemName: string;
    systemVersion: string;
}

interface IUser {
    _id: SchemaId.Id;
    id: string;
    nickname: string;
    initials: string;
    name: string;
    phone: string;
    address: string;
    fcmToken: string;
    deviceInfo?: DeviceInfoDTO;
    lastAccessAt?: Date;
    imageId: Image;
    createdAt: Date;
    updatedAt: Date;
}

export type { IUser, IDeviceInfo };
