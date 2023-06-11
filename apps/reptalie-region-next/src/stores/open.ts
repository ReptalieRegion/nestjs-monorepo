import { ReactNode } from 'react';
import { Root, createRoot } from 'react-dom/client';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type TSharePostsState = {
    [key in TOpenType]: Root | null;
};

interface IShareActions {
    open: ({ type, children }: IUseOpenModal) => void;
    close: (type: TOpenType) => void;
}

export type TOpenType = 'modal' | 'bottomSheet' | 'toast' | 'alert';

interface IUseOpenModal {
    children: ReactNode;
    type: TOpenType;
}

const defaultSharePostsState: TSharePostsState = {
    modal: null,
    bottomSheet: null,
    toast: null,
    alert: null,
};

const openStore = create<TSharePostsState & IShareActions>()(
    devtools((set, get) => ({
        ...defaultSharePostsState,
        open: ({ type, children }) => {
            const openType = get()[type];
            if (openType) {
                if (process.env.NODE_ENV === 'development') {
                    alert('두번 열수 없습니다.');
                }
                return;
            }

            const openElement = document.getElementById(type);
            if (openElement) {
                const root = createRoot(openElement);
                root.render(children);
                set((state) => ({ ...state, [type]: root }));
            }
        },
        close: (type) => {
            const openType = get()[type];
            if (openType) {
                openType.unmount();
                set((state) => ({ ...state, [type]: null }));
            }
        },
    })),
);
export default openStore;
