import Image from 'next/image';
import { TouchEventHandler, useState } from 'react';
import { useRef } from 'react';
import test from '@/assets/images/contemplative-reptile.jpg';

const images = [
    { src: test, alt: '1' },
    { src: test, alt: '2' },
    { src: test, alt: '3' },
];

const ImageSlider = () => {
    const scrollViewRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [touchPosition, setTouchPosition] = useState<number | null>(null);

    const handleTouchStart: TouchEventHandler<HTMLDivElement> = (event) => {
        const touchDown = event.touches[0].clientX;
        setTouchPosition(touchDown);
    };

    const handleTouchEnd: TouchEventHandler<HTMLDivElement> = (event) => {
        if (!scrollViewRef.current || !touchPosition) {
            return;
        }

        const scrollViewWidth = scrollViewRef.current.clientWidth;
        const currentScrollOffset = scrollViewRef.current.scrollLeft;
        const currentTouch = event.changedTouches[0].clientX;
        const isMoveRight =
            touchPosition - currentTouch > 0 && ((currentIndex + 1) * scrollViewWidth) / 2 < currentScrollOffset;
        const isMoveLeft = touchPosition - currentTouch < 0 && ((currentIndex + 1) * scrollViewWidth) / 2 > currentScrollOffset;

        if (isMoveRight) {
            scrollViewRef.current.scrollTo({
                left: (currentIndex + 1) * scrollViewWidth,
                behavior: 'smooth',
            });
            if (currentIndex < 2) {
                setCurrentIndex((state) => state + 1);
            }
        } else {
            scrollViewRef.current.scrollTo({
                left: currentIndex * scrollViewWidth,
                behavior: 'smooth',
            });
            if (currentIndex > 0) {
                setCurrentIndex((state) => state - 1);
            }
        }

        if (isMoveLeft) {
            scrollViewRef.current.scrollTo({
                left: (currentIndex + 1) * scrollViewWidth,
                behavior: 'smooth',
            });
            if (currentIndex < 2) {
                setCurrentIndex((state) => state + 1);
            }
        } else {
            scrollViewRef.current.scrollTo({
                left: currentIndex * scrollViewWidth,
                behavior: 'smooth',
            });
            if (currentIndex > 0) {
                setCurrentIndex((state) => state - 1);
            }
        }

        setTouchPosition(null);
    };

    return (
        <div className="relative flex flex-row justify-center mb-20pxr">
            <div
                ref={scrollViewRef}
                className="relative h-[188px] overflow-y-hidden overflow-x-scroll rounded-md w-[1500px]"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div>
                    {images.map(({ src, alt }, index) => (
                        <Image key={alt} src={src} alt={alt} className={`absolute left-[${index * 100}%]`} />
                    ))}
                </div>
            </div>
            <div className="absolute bottom-5pxr z-10 text-white">ººº</div>
        </div>
    );
};

export default ImageSlider;
