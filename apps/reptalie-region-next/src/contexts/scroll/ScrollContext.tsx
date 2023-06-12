import { IReactNode } from '<React>';
import { RefObject, createContext, useRef } from 'react';

interface IScrollContextProps {
    isScrollingRef: RefObject<boolean>;
}

const defaultValue: IScrollContextProps = {
    isScrollingRef: { current: false },
};

export const ScrollContext = createContext<IScrollContextProps>(defaultValue);

const ScrollComponentContext = ({ children }: IReactNode) => {
    const scrollRef = useRef<HTMLElement | null>(null);
    const isScrollingRef = useRef<boolean>(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const setIsScrolling = () => {
        isScrollingRef.current = true;
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
            isScrollingRef.current = false;
        }, 100);
    };

    return (
        <ScrollContext.Provider value={{ isScrollingRef }}>
            <section onScroll={setIsScrolling} ref={scrollRef} className="p-20pxr flex-1 overflow-y-scroll">
                {children}
            </section>
        </ScrollContext.Provider>
    );
};

export default ScrollComponentContext;
