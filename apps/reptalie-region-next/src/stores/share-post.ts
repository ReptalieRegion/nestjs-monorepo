import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type TImage = { [key: string]: number };

type TSharePostsState = {
    postsOfImages: TImage;
};

interface IShareActions {
    getCurrentImageIndex: (postId: string) => number;
    setCurrentImageIndex: (postId: string, index: number) => void;
}

const sharePostsStore = create<TSharePostsState & IShareActions>()(
    devtools(
        persist(
            (set, get) => ({
                postsOfImages: {},
                getCurrentImageIndex: (postId: string) => {
                    const { postsOfImages } = get();
                    const currentImageIndex = postsOfImages[postId];
                    return currentImageIndex ?? 0;
                },
                setCurrentImageIndex: (postId: string, index: number) => {
                    const { postsOfImages } = get();
                    set((state) => ({ ...state, postsOfImages: { ...postsOfImages, [postId]: index } }));
                },
            }),
            {
                name: 'share-posts-storage',
            },
        ),
    ),
);
export default sharePostsStore;
