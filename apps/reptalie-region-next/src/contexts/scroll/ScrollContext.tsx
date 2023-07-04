'use client';

import { CSSProperties, ReactNode, createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { throttle } from 'lodash-es';
import { RouterContext } from '../router/RouterContext';

interface IScrollComponentContextProps {
    children: ReactNode;
    uuid: string;
    customStyle?: Pick<CSSProperties, 'padding'>;
}

type TScrollDirection = 'down' | 'up' | 'none';
interface IScrollContextProps {
    scrollTop: number;
    isScrolling: boolean;
    scrollDirection: TScrollDirection;
    uuid: string;
    handleScrollToTop: () => void;
}

const defaultValue: IScrollContextProps = {
    scrollTop: 0,
    isScrolling: false,
    scrollDirection: 'none',
    uuid: '',
    handleScrollToTop: () => {},
};

export const ScrollContext = createContext<IScrollContextProps>(defaultValue);

const ScrollComponentContext = ({ children, customStyle, uuid }: IScrollComponentContextProps) => {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const prevScrollTopRef = useRef<number>(0);
    const [isScrolling, setIsScrolling] = useState<boolean>(false);
    const [scrollDirection, setScrollDirection] = useState<TScrollDirection>('none');
    const [scrollTop, setScrollTop] = useState<number>(0);
    const { currentOptions, setScrollInfo } = useContext(RouterContext);
    const throttleHandleScroll = useRef(
        throttle(() => {
            setIsScrolling(true);
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
            scrollTimeoutRef.current = setTimeout(() => {
                setIsScrolling(false);
            }, 100);

            const currentScrollTop = scrollRef.current?.scrollTop ?? 0;
            const newScrollDirection = calcScrollDirection(currentScrollTop);
            prevScrollTopRef.current = currentScrollTop;
            setScrollDirection(newScrollDirection);
            setScrollInfo({ uuid, scrollTop: currentScrollTop });
            setScrollTop(currentScrollTop);
        }, 500),
    ).current;

    useEffect(() => {
        const scrollInfo = currentOptions?.scrollInfo?.[uuid];
        if (scrollInfo) {
            scrollRef.current?.scrollTo({
                top: scrollInfo.scrollTop,
            });
        }
    }, [currentOptions, uuid]);

    const calcScrollDirection = (currentScrollTop: number): TScrollDirection => {
        const prevScrollTop = prevScrollTopRef.current;

        if (currentScrollTop <= 0) {
            return 'none';
        }

        if (currentScrollTop > prevScrollTop) {
            return 'down';
        }

        if (currentScrollTop < prevScrollTop) {
            return 'up';
        }

        return 'none';
    };

    const handleScroll = useCallback(() => {
        throttleHandleScroll();
    }, [throttleHandleScroll]);

    const handleScrollToTop = () => {
        scrollRef.current?.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <ScrollContext.Provider value={{ isScrolling, scrollDirection, scrollTop, uuid, handleScrollToTop }}>
            <div
                onScroll={handleScroll}
                ref={scrollRef}
                style={customStyle}
                className="p-20pxr h-full w-full flex-1 overflow-y-scroll"
            >
                {children}
            </div>
        </ScrollContext.Provider>
    );
};

export default ScrollComponentContext;
