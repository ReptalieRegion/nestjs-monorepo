'use client';

import Image from 'next/image';
import { useRef } from 'react';
import test from '@/assets/images/contemplative-reptile.jpg';
import useSwiper from '@/hooks/useSwiper';

const images = [
    { src: test, alt: '1' },
    { src: test, alt: '2' },
    { src: test, alt: '3' },
];

const ImageSlider = () => {
    const imagesRef = useRef<null[] | HTMLDivElement[]>([]);
    const swiperRef = useSwiper<HTMLDivElement>(images.length);

    return (
        <div className="relative flex flex-row justify-center mb-10pxr">
            <div ref={swiperRef} className="h-[250px] overflow-y-hidden overflow-x-hidden rounded-md scrollbar-hide">
                <div className={`w-[calc(300vw-120px)] h-[calc(300vw-120px)]`}>
                    {images.map(({ src, alt }, index) => {
                        return (
                            <div
                                ref={(element) => (imagesRef.current[index] = element)}
                                key={alt}
                                className="float-left w-[calc(100vw-40px)]"
                            >
                                <Image priority src={src} alt={alt} style={{ objectFit: 'cover', height: '250px' }} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ImageSlider;
