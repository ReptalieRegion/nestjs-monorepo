'use client';

import useSwipe from '@/hooks/useSwipe';
import { useContext, useEffect } from 'react';
import { IPostsData } from '<API>';
import sharePostsStore from '@/stores/share-post';
import MobileDiv from '@/components/ui/element/div/MobileDiv';
import HeartAnimation from '../atoms/HeartAnimation';
import ImagesContent from '../atoms/ImagesContent';
import { WebviewBridgeContext } from '@/contexts/webview-bridge/WebviewBridgeContext';

type TImagesSliderProps = Pick<IPostsData, 'images' | 'postId'>;

const PostImageCarousel = ({ postId, images }: TImagesSliderProps) => {
    const { Haptic } = useContext(WebviewBridgeContext);
    const { swipeRef, sliderCount } = useSwipe<HTMLDivElement>(images.length);
    const setStartLikeAnimation = sharePostsStore((state) => state.setStartLikeAnimation);
    const setCurrentImageIndex = sharePostsStore((state) => state.setCurrentImageIndex);
    const startLikeAnimation = sharePostsStore((state) => state.postsOfInfo[postId]?.startLikeAnimation);

    useEffect(() => {
        setCurrentImageIndex(postId, sliderCount);
    }, [sliderCount, postId, setCurrentImageIndex, setStartLikeAnimation]);

    const handleDoubleTabHeartAnimation = () => {
        setStartLikeAnimation(postId, true);

        if (!startLikeAnimation) {
            Haptic?.trigger({
                type: 'impactLight',
                options: { enableVibrateFallback: true, ignoreAndroidSystemSettings: false },
            });
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
