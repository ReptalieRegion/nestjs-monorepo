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
    ios: (notifeeOptions: NotifeeIOS) => ({
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
                        attachments: [
                            {
                                url: 'https://reptalie-region.s3.ap-northeast-2.amazonaws.com/c925604c-9369-4e00-8e0b-c563e2ce7578.jpeg',
                            },
                        ],
                    },
                    ...notifeeOptions,
                },
            },
        },
    }),
    android: () => ({
        priority: 'high',
    }),
};
