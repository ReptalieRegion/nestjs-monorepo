'use client';

import { IPostsData } from '<API>';
import { useState } from 'react';

type TPostHeaderProps = Pick<IPostsData, 'isFollow'>;

const Follow = ({ isFollow }: TPostHeaderProps) => {
    const [isFollowing, setIsFollowing] = useState<boolean>(isFollow);

    const handleClickFollow = () => {
        setIsFollowing((state) => !state);
    };

    return (
        <span className={`${isFollowing ? 'text-gray-500' : 'text-green-750'} font-semibold`} onClick={handleClickFollow}>
            {isFollowing ? '✓ 팔로잉' : '팔로우'}
        </span>
    );
};

export default Follow;
