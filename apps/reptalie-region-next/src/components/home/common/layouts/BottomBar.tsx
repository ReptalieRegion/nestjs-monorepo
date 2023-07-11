'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import Cart from '@/assets/icons/cart.svg';
import Community from '@/assets/icons/community.svg';
import Home from '@/assets/icons/home.svg';
import My from '@/assets/icons/my.svg';
import Share from '@/assets/icons/share.svg';
import { RouterContext } from '@/contexts/router/RouterContext';

const menus = [
    { pageURL: '/home', Icon: Home, name: '홈' },
    { pageURL: '/home/cart', Icon: Cart, name: '쇼핑' },
    { pageURL: '/home/share/list', Icon: Share, name: '일상공유' },
    { pageURL: '/home/community', Icon: Community, name: '정보공유' },
    { pageURL: '/home/my', Icon: My, name: '내 정보' },
];

export const HomeBottomBar = () => {
    const router = useContext(RouterContext);
    const path = usePathname();
    const [clickMenu, setClickMenu] = useState<string>('');

    const handleIconClick = (currentPath: string) => {
        setClickMenu(currentPath);
        router.replace(currentPath);
    };

    useEffect(() => {
        menus.forEach(({ pageURL }) => {
            router.prefetch(pageURL);
        });
    }, [router]);

    return (
        <div className="bg-white flex flex-row justify-between w-full items-center border-t-[1px] rounded-3xl shadow-inner">
            {menus.map(({ Icon, pageURL, name }) => {
                const currentPage = pageURL === path;
                const startAnimation = pageURL === clickMenu;

                return (
                    <div
                        key={pageURL}
                        onClick={() => handleIconClick(pageURL)}
                        className="w-full flex justify-center ease-in-out duration-200 items-center active:scale-[0.9] pt-20pxr pb-10pxr"
                    >
                        <div className="flex flex-col items-center justify-center">
                            <Icon
                                className={`${currentPage ? 'fill-teal-250' : 'fill-gray-550'} ${
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
