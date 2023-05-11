import { InputUserDTO } from './input-user.dto';

export interface IResponseUserDTO
    extends Pick<InputUserDTO, 'address' | 'email' | 'name' | 'nickname' | 'phone' | 'point' | 'recommender' | 'profileImage'> {
    readonly id: string;
}
