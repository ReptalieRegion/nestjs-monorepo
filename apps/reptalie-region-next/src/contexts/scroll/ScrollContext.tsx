import { CSSProperties, ReactNode, createContext, useCallback, useRef, useState } from 'react';
import { throttle } from 'lodash-es';

interface IScrollComponentContextProps {
    children: ReactNode;
    customStyle?: Pick<CSSProperties, 'padding'>;
}

type TScrollDirection = 'down' | 'up' | 'none';
interface IScrollContextProps {
    scrollTop: number;
    isScrolling: boolean;
    scrollDirection: TScrollDirection;
    handleScrollToTop: () => void;
}

const defaultValue: IScrollContextProps = {
    scrollTop: 0,
    isScrolling: false,
    scrollDirection: 'none',
    handleScrollToTop: () => {},
};

export const ScrollContext = createContext<IScrollContextProps>(defaultValue);

const ScrollComponentContext = ({ children, customStyle }: IScrollComponentContextProps) => {
    const scrollRef = useRef<HTMLElement | null>(null);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const prevScrollTopRef = useRef<number>(0);
    const [isScrolling, setIsScrolling] = useState<boolean>(false);
    const [scrollDirection, setScrollDirection] = useState<TScrollDirection>('none');
    const [scrollTop, setScrollTop] = useState<number>(0);
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
            setScrollTop(currentScrollTop);
        }, 500),
    ).current;

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
        <ScrollContext.Provider value={{ isScrolling, scrollDirection, scrollTop, handleScrollToTop }}>
            <section
                onScroll={handleScroll}
                ref={scrollRef}
                style={customStyle}
                className="p-20pxr h-full w-full flex-1 overflow-y-scroll"
            >
                {children}
            </section>
        </ScrollContext.Provider>
    );
};

export default ScrollComponentContext;
