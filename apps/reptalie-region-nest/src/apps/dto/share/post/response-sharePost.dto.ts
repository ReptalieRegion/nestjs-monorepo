import { InputSharePostDTO } from './input-sharePost.dto';

export interface IResponseSharePostDTO extends Pick<InputSharePostDTO, 'userId' | 'contents'> {
    readonly id: string;
    readonly isDeleted: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
