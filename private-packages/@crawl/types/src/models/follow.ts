import { SchemaId } from '../common/id';

interface IFollow {
    _id: SchemaId;
    id: string;
    following: SchemaId;
    follower: SchemaId;
    followerNickname: string;
    initials: string;
    isCanceled: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type { IFollow };
