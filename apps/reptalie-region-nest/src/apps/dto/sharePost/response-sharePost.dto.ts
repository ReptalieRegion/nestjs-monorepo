import { InputSharePostDTO } from './input-sharePost.dto';

export interface IResponseSharePostDTO extends Pick<InputSharePostDTO, 'content' | 'userId'> {
    readonly id: string;
    readonly isDeleted: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
