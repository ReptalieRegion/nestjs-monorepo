'use client';

import useSwipe from '@/hooks/useSwipe';
import { useEffect, useState } from 'react';
import { IPostsData } from '<API>';
import sharePostsStore from '@/stores/share-post';
import MobileDiv from '@/components/ui/div/MobileDiv';
import HeartAnimation from '../atoms/HeartAnimation';
import ImagesContent from '../atoms/ImagesContent';

type TImagesSliderProps = Pick<IPostsData, 'images' | 'postId'>;

const PostImageCarousel = ({ postId, images }: TImagesSliderProps) => {
    const { swipeRef: swipeRef, sliderCount } = useSwipe<HTMLDivElement>(images.length);
    const { setCurrentImageIndex } = sharePostsStore();
    const [startLike, setStartLike] = useState<boolean>(false);

    useEffect(() => {
        setCurrentImageIndex(postId, sliderCount);
    }, [sliderCount, postId, setCurrentImageIndex]);

    const handleDoubleTabHeartAnimation = () => {
        setStartLike(true);

        if (!startLike && window !== undefined && window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage('vibrate');
        }
    };

    return (
        <MobileDiv onDoubleTab={handleDoubleTabHeartAnimation} className="relative">
            <ImagesContent images={images} ref={swipeRef} />
            <HeartAnimation startLike={startLike} onAnimationEnd={() => setStartLike(false)} />
        </MobileDiv>
    );
};

export default PostImageCarousel;
