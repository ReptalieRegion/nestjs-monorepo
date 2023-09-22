import { InputUserDTO } from './input-user.dto';

export interface IResponseUserDTO
    extends Pick<InputUserDTO, 'userId' | 'name' | 'nickname' | 'phone' | 'address' | 'recommender'> {
    readonly id: string;
    readonly imageId: string;
}
