import { InputUserDTO } from './input-user.dto';

export interface IResponseUserDTO extends Pick<InputUserDTO, 'name' | 'nickname' | 'phone' | 'address' | 'imageId'> {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
