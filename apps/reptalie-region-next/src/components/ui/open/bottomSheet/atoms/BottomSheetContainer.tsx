'use client';

import { ReactNode, useEffect } from 'react';

interface IBottomSheetContainerProps {
    children: ReactNode;
    height: number;
    enableHeightTransition?: boolean;
    close?: () => void;
}

const BottomSheetContainer = ({ children, height, enableHeightTransition, close }: IBottomSheetContainerProps) => {
    useEffect(() => {
        if (height === 0) {
            setTimeout(() => close?.(), 10);
        }
    }, [height, close]);

    return (
        <div onClick={(event) => event.stopPropagation()} className="absolute left-0pxr bottom-[-1px] w-full overflow-y-scroll">
            <div
                style={{ transition: enableHeightTransition ? 'height 0.3s ease-out' : undefined, height }}
                className="w-full bg-white opacity-100 rounded-t-2xl flex flex-col"
            >
                {children}
            </div>
        </div>
    );
};

export default BottomSheetContainer;
