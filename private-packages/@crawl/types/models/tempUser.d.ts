import { SchemaId } from '../common/id';
import { SocialProviderType } from '../enums/social';

interface ITempUser {
    _id: SchemaId.Id;
    id: string;
    userId: SchemaId.Id;
    imageId: SchemaId.Id;
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
