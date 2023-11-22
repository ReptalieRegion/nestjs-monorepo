import { NotifeeIOS } from '../types/notificationPush.types';

export const DEEP_LINK_PREFIX = 'sharePost://';

export const DEEP_LINK_LIST = {
    notice: 'notice',
    sharePostUser: (nickname: string) => `users/${nickname}`,
    sharePostDetail: (postId: string, type: 'comment' | 'like') => `posts/${postId}/detail/${type}`,
} as const;

export const DEFAULT_NOTIFEE_OPTION_IOS = {
    sound: 'media/kick.wav',
    foregroundPresentationOptions: {
        alert: true,
        badge: true,
        sound: true,
        banner: true,
        list: true,
    },
};

export const DEFAULT_FCM_MESSAGE = {
    ios: (ios: NotifeeIOS) => ({
        apns: {
            payload: {
                aps: {
                    contentAvailable: true,
                    mutableContent: true,
                },
                notifee_options: {
                    ios: {
                        sound: 'media/kick.wav',
                        foregroundPresentationOptions: {
                            alert: true,
                            badge: true,
                            sound: true,
                            banner: true,
                            list: true,
                        },
                        ...ios,
                    },
                },
            },
        },
    }),
    android: () => ({
        priority: 'high',
    }),
};
