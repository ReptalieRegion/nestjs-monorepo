import { SchemaId } from '../common/id';
import { JoinProgressType, SocialProviderType } from '../enums/social';

interface ISocial {
    _id: SchemaId.Id;
    id: string;
    userId: SchemaId.Id;
    provider: SocialProviderType;
    uniqueId: string;
    joinProgress: JoinProgressType;
    salt: string;
    refreshToken: string;
    createdAt: Date;
    updatedAt: Date;
}

export type { ISocial };
