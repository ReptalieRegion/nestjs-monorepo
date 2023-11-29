import { InputSocialDTO } from './input-social.dto';

export interface IResponseSocialDTO
    extends Pick<InputSocialDTO, 'userId' | 'provider' | 'uniqueId' | 'joinProgress' | 'salt' | 'refreshToken'> {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
