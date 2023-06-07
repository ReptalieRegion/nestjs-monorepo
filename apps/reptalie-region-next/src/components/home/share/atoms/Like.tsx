'use client';

import { IPostsData } from '<API>';
import LikeIcon from '@/assets/icons/like.svg';
import { useState } from 'react';

type ILikeProps = Pick<IPostsData, 'isFollow' | 'postId'>;

const Like = ({ postId, isFollow }: ILikeProps) => {
    const [ani, setAni] = useState<boolean>(false);
    const handleClickLike = () => {
        setAni((state) => !state);
        console.log('좋아요 업데이트', postId, isFollow);
    };

    return (
        <div
            onClick={handleClickLike}
            className={`w-40pxr h-40pxr ${isFollow ? 'fill-red-500 stroke-red-500' : 'fill-white stroke-black'} ${
                ani ? 'transform scale-125' : 'scale-100'
            }`}
        >
            <LikeIcon />
        </div>
    );
};

export default Like;
