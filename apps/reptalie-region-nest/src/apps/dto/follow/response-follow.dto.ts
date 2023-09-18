import { InputFollowDTO } from './input-follow.dto';

export interface IResponseFollowDTO extends Pick<InputFollowDTO, 'following' | 'follower' | 'followerNickname'> {
    readonly id: string;
    readonly isCanceled: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
