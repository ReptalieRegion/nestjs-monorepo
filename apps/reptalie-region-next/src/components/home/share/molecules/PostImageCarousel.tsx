'use client';

import Image from 'next/image';
import useSwiper from '@/hooks/useSwiper';
import { useEffect, useState } from 'react';
import { IPostsData } from '<API>';
import sharePostsStore from '@/stores/share-post';
import MoblieDiv from '@/components/ui/div/MoblieDiv';
import HeartAnimation from '../atoms/HeartAnimation';

type TImagesSliderProps = Pick<IPostsData, 'images' | 'postId'>;

const PostImageCarousel = ({ postId, images }: TImagesSliderProps) => {
    const { swiperRef, sliderCount } = useSwiper<HTMLDivElement>(images.length);
    const { setCurrentImageIndex } = sharePostsStore();
    const [startLike, setStartLike] = useState<boolean>(false);

    useEffect(() => {
        setCurrentImageIndex(postId, sliderCount);
    }, [sliderCount, postId, setCurrentImageIndex]);

    return (
        <MoblieDiv onDoubleTab={() => setStartLike(true)} className="relative">
            <div className="relative flex flex-row justify-center mb-5pxr">
                <div ref={swiperRef} className="h-[250px] overflow-y-hidden overflow-x-hidden rounded-md scrollbar-hide">
                    <div
                        style={{
                            width: `calc(${images.length * 100}vw - ${images.length * 40}px)`,
                        }}
                    >
                        {images.map(({ src, alt }, index) => {
                            const key = postId + index.toString();
                            return (
                                <div key={key} className="float-left w-[calc(100vw-40px)]">
                                    <Image
                                        priority={index === 0}
                                        src={src}
                                        alt={alt}
                                        width={100}
                                        height={100}
                                        loading={index !== 0 ? 'lazy' : undefined}
                                        style={{ objectFit: 'cover', width: '100%', height: '250px' }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <HeartAnimation startLike={startLike} onAnimationEnd={() => setStartLike(false)} />
        </MoblieDiv>
    );
};

export default PostImageCarousel;
