import { SchemaId } from '../common/id';

interface IFollow {
    _id: SchemaId.Id;
    id: string;
    following: SchemaId.Id;
    follower: SchemaId.Id;
    followerNickname: string;
    initials: string;
    isCanceled: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type { IFollow };
