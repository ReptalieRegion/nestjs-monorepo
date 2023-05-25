'use client';

import Image from 'next/image';
import { TouchEventHandler, useState } from 'react';
import { useRef } from 'react';
import test from '@/assets/images/contemplative-reptile.jpg';
import { newLongTouch } from '@/utils/gestures/LongTouch';

const images = [
    { src: test, alt: '1' },
    { src: test, alt: '2' },
    { src: test, alt: '3' },
];

const ImageSlider = () => {
    const scrollViewRef = useRef<HTMLDivElement>(null);
    const imagesRef = useRef<null[] | HTMLDivElement[]>([]);
    const currentIndexRef = useRef<number>(0);
    const [touchPosition, setTouchPosition] = useState<number | null>(null);

    const handleTouchStart: TouchEventHandler<HTMLDivElement> = (event) => {
        newLongTouch.onStart();
        const touchDown = event.touches[0].clientX;
        setTouchPosition(touchDown);
    };

    const handleTouchEnd: TouchEventHandler<HTMLDivElement> = (event) => {
        if (!scrollViewRef.current || !touchPosition) {
            return;
        }
        newLongTouch.onEnd();
        const isLongTab = newLongTouch.getIsLongTab();
        const currentTouch = event.changedTouches[0].clientX;
        const currentIndex = currentIndexRef.current;
        const isMoveRight = touchPosition - currentTouch > 0 && currentIndex < images.length - 1;
        const isMoveLeft = touchPosition - currentTouch < 0 && currentIndex > 0;
        const scrollViewElement = scrollViewRef.current;
        const contentWidth = scrollViewElement.clientWidth;

        if (!isLongTab) {
            if (isMoveRight) {
                const movePosition = contentWidth * (currentIndex + 1);
                scrollViewRef.current.scrollTo({
                    left: movePosition,
                    behavior: 'smooth',
                });
                currentIndexRef.current += 1;
            }

            if (isMoveLeft) {
                const movePosition = contentWidth * (currentIndex - 1);
                scrollViewRef.current.scrollTo({
                    left: movePosition,
                    behavior: 'smooth',
                });
                currentIndexRef.current -= 1;
            }
        } else {
            const currentImageRef = imagesRef.current[currentIndex];
            if (!currentImageRef) {
                return;
            }
            const contentPositionX = scrollViewElement.getBoundingClientRect().x;

            if (isMoveRight) {
                const nextImageRef = imagesRef.current[currentIndex + 1];
                if (!nextImageRef) {
                    return;
                }

                const nextImagePositionX = nextImageRef.getBoundingClientRect().x;

                const isMoveNextImage = contentWidth / 2 > nextImagePositionX - contentPositionX;
                const movePosition = isMoveNextImage ? contentWidth * (currentIndex + 1) : contentWidth * currentIndex;

                scrollViewRef.current.scrollTo({
                    left: movePosition,
                    behavior: 'smooth',
                });

                currentIndexRef.current += isMoveNextImage ? 1 : 0;
            }

            if (isMoveLeft) {
                const prevImageRef = imagesRef.current[currentIndex - 1];
                if (!prevImageRef) {
                    return;
                }

                const prevImagePositionX = prevImageRef.getBoundingClientRect().right;
                const isMovePrevImage = contentWidth / 2 < prevImagePositionX - contentPositionX;
                const movePosition = isMovePrevImage ? contentWidth * (currentIndex - 1) : contentWidth * currentIndex;

                scrollViewRef.current.scrollTo({
                    left: movePosition,
                    behavior: 'smooth',
                });
                currentIndexRef.current -= isMovePrevImage ? 1 : 0;
            }
        }

        setTouchPosition(null);
    };

    return (
        <div className="relative flex flex-row justify-center mb-20pxr">
            <div
                ref={scrollViewRef}
                className="h-[188px] overflow-y-hidden overflow-x-scroll rounded-md"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div className={`w-[calc(300vw-120px)]`}>
                    {images.map(({ src, alt }, index) => {
                        return (
                            <div
                                ref={(element) => (imagesRef.current[index] = element)}
                                key={alt}
                                className="float-left w-[calc(100vw-40px)]"
                            >
                                <Image priority src={src} alt={alt} className="w-full" />
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="absolute bottom-5pxr z-10 text-white">ººº</div>
        </div>
    );
};

export default ImageSlider;
