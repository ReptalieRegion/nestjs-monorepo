import { ReactNode } from 'react';

interface IBottomSheetContainerProps {
    children: ReactNode;
    height?: number;
    enableHeightTransition?: boolean;
}

const BottomSheetContainer = ({ children, height, enableHeightTransition }: IBottomSheetContainerProps) => {
    return (
        <div onClick={(event) => event.stopPropagation()} className="absolute left-0pxr bottom-0pxr w-full overflow-y-scroll">
            <div
                style={{ transition: enableHeightTransition ? 'height 0.3s ease-out' : undefined, height }}
                className="w-full bg-white opacity-100 rounded-t-2xl pl-20pxr pr-20pxr pb-15pxr h-full"
            >
                {children}
            </div>
        </div>
    );
};

export default BottomSheetContainer;
