import { InputTempUserDTO } from './input-tempUser.dto';

export interface IResponseTempUserDTO
    extends Pick<InputTempUserDTO, 'userId' | 'imageId' | 'provider' | 'uniqueId' | 'nickname' | 'name' | 'phone' | 'address'> {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
