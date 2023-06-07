import customDirection, { TMoveType } from '@/utils/gestures/Direction';
import customlongTouch from '@/utils/gestures/LongTouch';
import customScroll from '@/utils/gestures/Scroll';
import { useEffect, useRef } from 'react';

const useSwiper = <T extends HTMLElement>(maxSlideCount = 0) => {
    const swiperRef = useRef<T>(null);
    const slideCountRef = useRef(0);

    useEffect(() => {
        const swiperElement = swiperRef.current;
        if (!swiperElement) {
            return;
        }

        const { clientWidth, clientHeight } = swiperElement;
        const longTouch = customlongTouch();
        const direction = customDirection()({
            width: clientWidth,
            height: clientHeight,
        });
        const scroll = customScroll({ element: swiperRef.current })();

        const touchStart = (event: TouchEvent) => {
            longTouch.start();
            direction.start(event);
            scroll.start(event);
        };

        const touchMove = (event: TouchEvent) => {
            direction.move(event);
            const moveType = direction.getMoveType();
            const isHorizontality = moveType === 2 || moveType === 3;
            if (isHorizontality) {
                event.preventDefault();
                event.stopPropagation();
                scroll.moveHorizontality(event);
            }
        };

        const touchEnd = () => {
            const isLongTouch = longTouch.getIsLongTouch();
            const moveType = direction.getMoveType();
            direction.end();
            longTouch.end();

            if (isLongTouch) {
                longTouchMove(moveType);
                return;
            }

            shortTouchMove(moveType);
        };

        const shortTouchMove = (moveType: TMoveType) => {
            const leftDirection = moveType === 2;
            if (leftDirection) {
                moveNext();
                return;
            }

            const rightDirection = moveType === 3;
            if (rightDirection) {
                movePrev();
                return;
            }
        };

        const longTouchMove = (moveType: TMoveType) => {
            const sliderWidth = swiperElement.clientWidth;
            const scrollLeft = swiperElement.scrollLeft;
            const slideCount = slideCountRef.current;
            const leftDirection = scrollLeft > sliderWidth * slideCount + sliderWidth / 2 && moveType === 2;
            if (leftDirection) {
                moveNext();
                return;
            }

            const rightDirection = scrollLeft < sliderWidth * slideCount - sliderWidth / 2 && moveType === 3;
            if (rightDirection) {
                movePrev();
                return;
            }

            moveCurrent();
        };

        const moveCurrent = () => {
            const slideCount = slideCountRef.current;
            const movePosition = slideCount * swiperElement.clientWidth;
            scroll.scrollToLeftSmooth(movePosition);
        };

        const movePrev = () => {
            const slideCount = slideCountRef.current;
            if (slideCount > 0) {
                const movePosition = (slideCount - 1) * swiperElement.clientWidth;
                scroll.scrollToLeftSmooth(movePosition);
                slideCountRef.current -= 1;
            }
        };

        const moveNext = () => {
            const slideCount = slideCountRef.current;
            if (slideCount < maxSlideCount - 1) {
                const movePosition = (slideCount + 1) * swiperElement.clientWidth;
                scroll.scrollToLeftSmooth(movePosition);
                slideCountRef.current += 1;
            }
        };

        swiperElement.addEventListener('touchstart', touchStart);
        swiperElement.addEventListener('touchmove', touchMove);
        swiperElement.addEventListener('touchend', touchEnd);
        swiperElement.addEventListener('touchcancel', touchEnd);

        return () => {
            swiperElement.removeEventListener('touchstart', touchStart);
            swiperElement.removeEventListener('touchmove', touchMove);
            swiperElement.removeEventListener('touchend', touchEnd);
            swiperElement.removeEventListener('touchcancel', touchEnd);
        };
    }, [maxSlideCount]);

    return swiperRef;
};

export default useSwiper;