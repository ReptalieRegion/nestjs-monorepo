'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import Cart from '@/assets/icons/cart.svg';
import Community from '@/assets/icons/community.svg';
import Home from '@/assets/icons/home.svg';
import My from '@/assets/icons/my.svg';
import Share from '@/assets/icons/share.svg';

const Bottombar = () => {
    const router = useRouter();
    const path = usePathname();
    const menus = [
        { ref: useRef<HTMLDivElement>(null), pageURL: '/home', Icon: Home, name: '홈' },
        { ref: useRef<HTMLDivElement>(null), pageURL: '/home/cart', Icon: Cart, name: '쇼핑' },
        { ref: useRef<HTMLDivElement>(null), pageURL: '/home/share', Icon: Share, name: '일상공유' },
        { ref: useRef<HTMLDivElement>(null), pageURL: '/home/community', Icon: Community, name: '정보공유' },
        { ref: useRef<HTMLDivElement>(null), pageURL: '/home/my', Icon: My, name: '내 정보' },
    ];
    const [clickMenu, setClickMenu] = useState<string>('');

    const handleIconClick = (currentPath: string) => {
        setClickMenu(currentPath);
        router.replace(currentPath);
    };

    return (
        <div className="fixed bottom-0pxr h-80pxr flex flex-row justify-between w-full items-center">
            {menus.map(({ Icon, pageURL, name, ref }) => {
                const currenPage = pageURL === path;
                const startAnimation = pageURL === clickMenu;

                return (
                    <div
                        ref={ref}
                        key={pageURL}
                        onClick={() => handleIconClick(pageURL)}
                        className="w-full h-full flex justify-center ease-in-out duration-200 items-center active:scale-[0.9]"
                    >
                        <div className="flex flex-col items-center justify-center">
                            <Icon
                                className={`${currenPage ? 'fill-teal-250' : 'fill-gray-500'} ${
                                    startAnimation ? 'animate-scale-up-down' : ''
                                }`}
                                onAnimationEnd={() => setClickMenu('')}
                            />
                            <span className="text-xxs mt-6pxr">{name}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Bottombar;
