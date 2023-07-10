import { ReactNode } from 'react';

interface IBottomSheet {
    children: ReactNode;
    shouldCloseOnBackdropClick?: boolean;
    close?: () => void;
}

const BackDrop = ({ children, close, shouldCloseOnBackdropClick = true }: IBottomSheet) => {
    const handleBackDropClick = () => {
        if (shouldCloseOnBackdropClick) {
            close?.();
        }
    };

    return (
        <div onClick={handleBackDropClick} className={`fixed top-0pxr left-0pxr w-full h-full bg-black bg-opacity-50`}>
            {children}
        </div>
    );
};

export default BackDrop;
