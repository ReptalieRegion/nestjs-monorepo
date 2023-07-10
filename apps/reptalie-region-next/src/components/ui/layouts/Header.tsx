'use client';

import Logo from '@/assets/icons/logo.svg';
import BackButton from '@/assets/icons/back_button.svg';
import { IHeaderProps, TLeftIcon } from '<Header>';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { RouterContext } from '@/contexts/router/RouterContext';

type TLeftIconMap = {
    [key in TLeftIcon]: {
        Icon: any;
        onClick: () => void;
    };
};

const Header = ({ left, center, right }: IHeaderProps) => {
    const router = useContext(RouterContext);
    const leftIconMap: TLeftIconMap = {
        back: { Icon: BackButton, onClick: () => router.back() },
        cancel: { Icon: BackButton, onClick: () => router.back() },
        logo: { Icon: Logo, onClick: () => router.replace('/home') },
    };
    const leftInfo = left && leftIconMap[left];

    return (
        <div className="left-0pxr top-0pxr w-full bg-white flex flex-row justify-between items-center p-10pxr border-b-[1px]">
            {leftInfo !== undefined && (
                <div
                    className={`flex flex-col items-center justify-center ${
                        left === 'back' ? 'active:opacity-50 active:scale-90 active:translate-x-[-7px] active:duration-100' : ''
                    }`}
                    onClick={leftInfo.onClick}
                >
                    <leftInfo.Icon />
                </div>
            )}
            <div>{center}</div>
            <div className="w-32pxr">{right}</div>
        </div>
    );
};

export default Header;
