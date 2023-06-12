'use client';

import useSwipe from '@/hooks/useSwipe';
import { useEffect, useState } from 'react';
import { IPostsData } from '<API>';
import sharePostsStore from '@/stores/share-post';
import MobileDiv from '@/components/ui/element/div/MobileDiv';
import HeartAnimation from '../atoms/HeartAnimation';
import ImagesContent from '../atoms/ImagesContent';

type TImagesSliderProps = Pick<IPostsData, 'images' | 'postId'>;

const PostImageCarousel = ({ postId, images }: TImagesSliderProps) => {
    const { swipeRef, sliderCount } = useSwipe<HTMLDivElement>(images.length);
    const setStartLikeAnimation = sharePostsStore((state) => state.setStartLikeAnimation);
    const setCurrentImageIndex = sharePostsStore((state) => state.setCurrentImageIndex);
    const startLikeAnimation = sharePostsStore((state) => state.postsOfInfo[postId]?.startLikeAnimation);

    useEffect(() => {
        setCurrentImageIndex(postId, sliderCount);
    }, [sliderCount, postId, setCurrentImageIndex, setStartLikeAnimation]);

    const handleDoubleTabHeartAnimation = () => {
        setStartLikeAnimation(postId, true);

        if (!startLikeAnimation && window !== undefined && window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage('vibrate');
        }
    };

    return (
        <MobileDiv onDoubleTab={handleDoubleTabHeartAnimation} className="relative">
            <ImagesContent images={images} ref={swipeRef} />
            <HeartAnimation startLike={startLikeAnimation} onAnimationEnd={() => setStartLikeAnimation(postId, false)} />
        </MobileDiv>
    );
};

export default PostImageCarousel;
