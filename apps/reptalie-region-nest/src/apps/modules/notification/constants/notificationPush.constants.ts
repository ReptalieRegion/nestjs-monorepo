export const DEEP_LINK_PREFIX = 'sharePost://';

export const DEEP_LINK_LIST = {
    sharePostUser: (nickname: string) => `users/${nickname}`,
    sharePostDetail: (postId: string, type: 'comment' | 'like') => `posts/${postId}/detail/${type}`,
} as const;
