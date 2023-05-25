import { useEffect, useRef } from 'react';

export const useSwiper = () => {
    const swiperRef = useRef<HTMLDivElement>(null);

    const onTouchStart = (e: TouchEvent) => {
        console.log(e);
    };

    const onTouchMove = (e: TouchEvent) => {
        console.log(e);
    };

    const onTouchEnd = (e: TouchEvent) => {
        console.log(e);
    };

    useEffect(() => {
        const swiperNode = swiperRef.current;
        swiperNode?.addEventListener('touchstart', onTouchStart);
        swiperNode?.addEventListener('touchmove', onTouchMove);
        swiperNode?.addEventListener('touchend', onTouchEnd);

        return () => {
            swiperNode?.removeEventListener('touchstart', onTouchStart);
            swiperNode?.removeEventListener('touchmove', onTouchMove);
            swiperNode?.removeEventListener('touchend', onTouchEnd);
        };
    }, []);

    return swiperRef;
};
