'use client';

import { useRouter } from 'next/navigation';
import { MutableRefObject, ReactNode, createContext, useRef, useState } from 'react';

interface IRouterComponentContextProps {
    children: ReactNode;
}

export interface NavigateOptions {}

type TStack = {
    href: string;
    options?: NavigateOptions & TCurrentOptions;
};

enum PrefetchKind {
    AUTO = 'auto',
    FULL = 'full',
    TEMPORARY = 'temporary',
}

interface PrefetchOptions {
    kind: PrefetchKind;
}

type TCurrentOptions = {
    query?: {
        refetch: boolean;
    };
    scrollInfo?: {
        [key: string]: {
            scrollTop?: number;
            scrollLeft?: number;
        };
    };
};

export interface IRouterContextValue {
    push: (href: string, options?: NavigateOptions) => void;
    back: () => void;
    replace: (href: string, options?: NavigateOptions) => void;
    prefetch: (url: string, options?: PrefetchOptions) => void;
    setScrollInfo: ({ uuid, scrollTop, scrollLeft }: any) => void;
    currentOptions?: MutableRefObject<TCurrentOptions | undefined>;
}

const defaultRouterContextValue: IRouterContextValue = {
    push: () => {},
    back: () => {},
    replace: () => {},
    prefetch: () => {},
    setScrollInfo: () => {},
    currentOptions: undefined,
};

export const RouterContext = createContext<IRouterContextValue>(defaultRouterContextValue);

const RouterComponentContext = ({ children }: IRouterComponentContextProps) => {
    const stack = useRef<TStack[]>([{ href: '/' }]);
    const router = useRouter();
    const currentOptions = useRef<TCurrentOptions | undefined>();

    defaultRouterContextValue.push = (href: string, options?: NavigateOptions) => {
        if (stack.current.length === 0) {
            return;
        }

        const last = stack.current.pop();
        if (last) {
            last.options = currentOptions.current;
            stack.current = [...stack.current, last];
        }

        stack.current.push({ href, options });
        router.replace(href, options);
    };

    defaultRouterContextValue.back = () => {
        if (stack.current.length < 2) {
            return;
        }

        stack.current.pop();

        const { href, options } = stack.current[stack.current.length - 1];
        currentOptions.current = options;
        router.replace(href, options);
    };

    defaultRouterContextValue.replace = (href: string, options?: NavigateOptions) => {
        if (stack.current.length > 1) {
            stack.current.pop();
        }

        stack.current.push({ href, options });
        router.replace(href, options);
    };

    defaultRouterContextValue.prefetch = (url: string, options?: PrefetchOptions) => {
        router.prefetch(url, options);
    };

    defaultRouterContextValue.setScrollInfo = ({ uuid, scrollTop, scrollLeft }: any) => {
        currentOptions.current = {
            ...currentOptions.current,
            scrollInfo: {
                ...currentOptions.current?.scrollInfo,
                [uuid]: {
                    scrollTop,
                    scrollLeft,
                },
            },
        };
    };

    return (
        <RouterContext.Provider value={{ ...defaultRouterContextValue, currentOptions: currentOptions }}>
            {children}
        </RouterContext.Provider>
    );
};

export default RouterComponentContext;
