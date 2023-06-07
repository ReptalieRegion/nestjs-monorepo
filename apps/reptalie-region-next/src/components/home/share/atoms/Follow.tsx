'use client';

import { useState } from 'react';

const Follow = () => {
    const [isFollowing, setIsFollowing] = useState<boolean>(false);

    const handleClickFollow = () => {
        setIsFollowing((state) => !state);
    };

    return (
        <span className={`${isFollowing ? 'text-gray-500' : 'text-teal-150'} font-semibold`} onClick={handleClickFollow}>
            {isFollowing ? '✓ 팔로잉' : '팔로우'}
        </span>
    );
};

export default Follow;
