import { InputUserDTO } from './input-user.dto';

export interface IResponseUserDTO
    extends Pick<InputUserDTO, 'address' | 'userId' | 'name' | 'nickname' | 'phone' | 'point' | 'recommender' | 'profileImage'> {
    readonly id: string;
}
