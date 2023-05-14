'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Cart from '@/assets/icons/cart.svg';
import Community from '@/assets/icons/community.svg';
import Home from '@/assets/icons/home.svg';
import My from '@/assets/icons/my.svg';
import Share from '@/assets/icons/share.svg';

const routePrefix = '/home';
const icons = [
    { page: '', Component: Home },
    { page: '/cart', Component: Cart },
    { page: '/share', Component: Share },
    { page: '/community', Component: Community },
    { page: '/my', Component: My },
];

const Bottombar = () => {
    const router = useRouter();
    const [selected, setSelected] = useState<string>();
    const [isAnimation, setIsAnimation] = useState<string>('/');

    useEffect(() => setSelected(window.location.pathname), []);

    const handleIconClick = (page: string) => {
        setSelected(routePrefix + page);
        setIsAnimation(page);
        router.replace(routePrefix + page);
    };

    return (
        <>
            <div className="fixed bottom-0pxr h-80pxr flex flex-row justify-between w-full items-center">
                {icons.map(({ Component, page }) => (
                    <div
                        key={page}
                        onClick={() => handleIconClick(page)}
                        className="w-full h-full flex justify-center icon-click items-center"
                    >
                        <Component
                            className={`icon-size-down ${selected === routePrefix + page ? 'fill-teal-250' : 'fill-gray-500'} ${
                                isAnimation === page ? 'animation' : ''
                            }`}
                            onAnimationEnd={() => setIsAnimation('/')}
                        />
                    </div>
                ))}
            </div>
            <style jsx>{`
                .icon-click {
                    transition: all 0.3s ease-in-out;
                }

                .icon-click:active .icon-size-down {
                    transform: scale(0.85);
                }

                .animation {
                    animation: scaleAnimation 0.3s ease-in-out;
                }

                @keyframes scaleAnimation {
                    0% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.15);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
            `}</style>
        </>
    );
};

export default Bottombar;
