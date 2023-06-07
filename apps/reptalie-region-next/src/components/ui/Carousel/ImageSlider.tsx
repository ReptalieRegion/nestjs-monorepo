'use client';

import Image from 'next/image';
import useSwiper from '@/hooks/useSwiper';
import { useEffect } from 'react';
import { IPostsData } from '<API>';
import sharePostsStore from '@/stores/share-post';

type TImagesSliderProps = Pick<IPostsData, 'images' | 'postId'>;

const ImageSlider = ({ postId, images }: TImagesSliderProps) => {
    const { swiperRef, sliderCount } = useSwiper<HTMLDivElement>(images.length);
    const { setCurrentImageIndex } = sharePostsStore();

    useEffect(() => {
        setCurrentImageIndex(postId, sliderCount);
    }, [sliderCount, postId, setCurrentImageIndex]);

    return (
        <div className="relative flex flex-row justify-center mb-5pxr">
            <div ref={swiperRef} className="h-[250px] overflow-y-hidden overflow-x-hidden rounded-md scrollbar-hide">
                <div
                    style={{
                        width: `calc(${images.length * 100}vw - ${images.length * 40}px)`,
                    }}
                >
                    {images.map(({ src, alt }) => {
                        return (
                            <div key={alt} className="float-left w-[calc(100vw-40px)]">
                                <Image
                                    priority
                                    src={src}
                                    alt={alt}
                                    width={100}
                                    height={100}
                                    style={{ objectFit: 'cover', width: '100%', height: '250px' }}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ImageSlider;
