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
    extends Pick<InputUserDTO, 'name' | 'nickname' | 'phone' | 'address' | 'fcmToken' | 'imageId'> {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
