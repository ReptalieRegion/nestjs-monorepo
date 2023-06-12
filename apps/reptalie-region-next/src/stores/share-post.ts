import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type TPostsInfo = {
    [postId: string]: {
        imageIndex: number;
        startLikeAnimation: boolean;
    };
};

type TSharePostsState = {
    postsOfInfo: TPostsInfo;
};

interface IShareActions {
    setCurrentImageIndex: (postId: string, index: number) => void;
    setStartLikeAnimation: (postId: string, startLikeAnimation: boolean) => void;
}

const sharePostsStore = create<TSharePostsState & IShareActions>()(
    devtools(
        persist(
            (set, get) => ({
                postsOfInfo: {},
                setCurrentImageIndex: (postId, index) => {
                    const { postsOfInfo } = get();
                    const postInfo = postsOfInfo[postId];
                    const newPostInfo: TPostsInfo = {
                        [postId]: {
                            ...postInfo,
                            imageIndex: index,
                        },
                    };
                    set((state) => ({
                        ...state,
                        postsOfInfo: {
                            ...postsOfInfo,
                            ...newPostInfo,
                        },
                    }));
                },
                setStartLikeAnimation: (postId, startLikeAnimation) => {
                    const { postsOfInfo } = get();
                    const postInfo = postsOfInfo[postId];
                    const newPostInfo: TPostsInfo = {
                        [postId]: {
                            ...postInfo,
                            startLikeAnimation,
                        },
                    };
                    set((state) => ({
                        ...state,
                        postsOfInfo: {
                            ...postsOfInfo,
                            ...newPostInfo,
                        },
                    }));
                },
            }),
            {
                name: 'share-posts-storage',
            },
        ),
    ),
);
export default sharePostsStore;
