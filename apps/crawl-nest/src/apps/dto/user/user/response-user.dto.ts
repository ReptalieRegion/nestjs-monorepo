import { InputUserDTO } from './input-user.dto';

export interface IUserProfileDTO {
    readonly id: string;
    readonly nickname: string;
    readonly profile: {
        src: string;
    };
    readonly isFollow?: boolean;
    readonly fcmToken?: string;
}

export interface IResponseUserDTO
    extends Pick<InputUserDTO, 'name' | 'nickname' | 'initials' | 'phone' | 'address' | 'fcmToken' | 'imageId'> {
    readonly id: string;
    readonly deviceInfo: {
        readonly version: string;
        readonly buildNumber: string;
        readonly systemName: string;
        readonly systemVersion: string;
    };
    readonly lastAccessAt: Date;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
