import { SchemaId } from '../common/id';
import { SocialProviderType } from '../enums/social';

interface ITempUser {
    _id: SchemaId;
    id: string;
    userId: SchemaId;
    imageId: SchemaId;
    provider: SocialProviderType;
    uniqueId: string;
    nickname: string;
    name: string;
    phone: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}

export type { ITempUser };
