'use client';

import { ScrollContext } from '@/contexts/scroll/ScrollContext';
import UpArrowIcon from '@/assets/icons/up_arrow.svg';
import { useContext, useEffect, useState } from 'react';

interface IScrollToTopButtonProps {
    className?: string;
}

const ScrollToTopButton = ({}: IScrollToTopButtonProps) => {
    const { scrollDirection, handleScrollToTop, scrollTop } = useContext(ScrollContext);
    const [isShowButton, setIsShowButton] = useState<string>('none');
    const [isBlockShowButton, setIsBlockShowButton] = useState<boolean>(false);

    useEffect(() => {
        if (isBlockShowButton) {
            return;
        }

        if (scrollDirection === 'up') {
            setIsShowButton('up');
            return;
        }

        if (isShowButton === 'up' && scrollDirection === 'down') {
            setIsShowButton('down');
            return;
        }

        if (scrollDirection === 'none') {
            setIsShowButton('none');
        }
    }, [isBlockShowButton, isShowButton, scrollDirection]);

    useEffect(() => {
        if (scrollTop === 0) {
            setIsBlockShowButton(false);
        }
    }, [scrollTop]);

    const handleIconClick = () => {
        handleScrollToTop();
        setIsBlockShowButton(true);
        setIsShowButton('down');
    };

    return (
        <div
            onClick={handleIconClick}
            className={`flex justify-center items-center w-50pxr h-50pxr absolute bottom-0pxr rounded-full bg-white active:scale-[0.85] transition-all border-[1px] border-gray-200 ${
                isShowButton === 'up' ? 'animate-up-opacity' : isShowButton === 'down' ? 'animate-down-opacity' : ''
            }`}
        >
            <UpArrowIcon />
        </div>
    );
};

export default ScrollToTopButton;
