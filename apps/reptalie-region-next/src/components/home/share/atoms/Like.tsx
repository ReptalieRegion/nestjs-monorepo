'use client';

import { IPostsData } from '<API>';
import LikeIcon from '@/assets/icons/like.svg';
import sharePostsStore from '@/stores/share-post';
import { useEffect, useState } from 'react';

type ILikeProps = Pick<IPostsData, 'isLike' | 'postId'>;

const Like = ({ postId, isLike }: ILikeProps) => {
    const startLikeAnimation = sharePostsStore((state) => state.postsOfInfo[postId]?.startLikeAnimation);
    const [filledLikeColor, setFilledLikeColor] = useState<boolean>(isLike);

    useEffect(() => {
        if (startLikeAnimation) {
            setFilledLikeColor(true);
        }
    }, [startLikeAnimation]);

    const handleLikeClick = () => {
        setFilledLikeColor((state) => !state);
    };

    return (
        <div
            onClick={handleLikeClick}
            className={`w-40pxr h-40pxr ${filledLikeColor ? 'fill-red-500 stroke-red-500' : 'fill-white stroke-black'} ${
                startLikeAnimation ? 'animate-scale-2-up-down' : 'scale-100'
            }`}
        >
            <LikeIcon />
        </div>
    );
};

export default Like;
