import customLongTouch from '@/utils/gestures/LongTouch';
import { useEffect, useRef, useState } from 'react';

interface IUseBottomSheet {
    minHeight: number;
    maxHeight: number;
}

const useBottomSheetDrag = ({ minHeight, maxHeight }: IUseBottomSheet) => {
    const bottomSheetDragAreaRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef<boolean>(false);
    const startYRef = useRef<number>(0);
    const deltaYRef = useRef<number>(0);
    const [isTouchEnd, setIsTouchEnd] = useState<boolean>(false);
    const [lastHeight, setLastHeight] = useState<number>(minHeight);
    const [changeHeight, setChangeHeight] = useState<number>(minHeight);

    useEffect(() => {
        const bottomSheetDragAreaElement = bottomSheetDragAreaRef.current;
        const longTouch = customLongTouch();
        if (!bottomSheetDragAreaElement) {
            return;
        }

        const touchStart = (event: TouchEvent) => {
            longTouch.start();
            isDragging.current = true;
            const touch = event.touches[0];
            startYRef.current = touch.clientY - bottomSheetDragAreaElement.offsetTop;
            setIsTouchEnd(false);
        };

        const touchMove = (event: TouchEvent) => {
            if (!isDragging.current) {
                return;
            }

            const newDeltaY = event.touches[0].clientY - startYRef.current;
            const newHeight = Math.min(Math.max(lastHeight - newDeltaY, minHeight), maxHeight);
            deltaYRef.current = newDeltaY;
            setChangeHeight(newHeight);
        };

        const touchEnd = () => {
            longTouch.end();
            const newHeight = createHeight();
            isDragging.current = false;
            setChangeHeight(newHeight);
            setLastHeight(newHeight);
            setIsTouchEnd(true);
        };

        const createHeight = () => {
            const isLongTouch = longTouch.getIsLongTouch();
            const isDownMotion = deltaYRef.current > 0;
            if (isLongTouch) {
                return changeHeight < maxHeight / 2 ? minHeight : maxHeight;
            }

            return isDownMotion ? minHeight : maxHeight;
        };

        bottomSheetDragAreaElement.addEventListener('touchstart', touchStart, { passive: true });
        bottomSheetDragAreaElement.addEventListener('touchmove', touchMove, { passive: false });
        bottomSheetDragAreaElement.addEventListener('touchend', touchEnd, { passive: true });

        return () => {
            bottomSheetDragAreaElement.removeEventListener('touchstart', touchStart);
            bottomSheetDragAreaElement.removeEventListener('touchmove', touchMove);
            bottomSheetDragAreaElement.removeEventListener('touchend', touchEnd);
        };
    }, [changeHeight, lastHeight, maxHeight, minHeight]);

    return { bottomSheetDragAreaRef, changeHeight, isTouchEnd };
};

export default useBottomSheetDrag;
