import { IUser } from '@private-crawl/types';

type IUserProfileDTO = Pick<IUser, 'id' | 'nickname' | 'phone' | 'fcmToken'> & {
    profile: {
        src: string;
    };
    isFollow?: boolean;
};

export type { IUserProfileDTO };
