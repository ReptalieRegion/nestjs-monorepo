import { InputSharePostDTO } from './input-sharePost.dto';

export interface IResponseSharePostDTO extends Pick<InputSharePostDTO, 'contents'> {
    readonly id: string;
    readonly userId: string;
    readonly isDeleted: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
