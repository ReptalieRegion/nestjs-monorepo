'use client';

import { useEffect } from 'react';
import Skeleton from '../atoms/Skeleton';
import PostCard from '../organisms/PostCard';
import { useFetchPosts } from '@/react-query/home/share/client/hooks';
import sharePostsStore, { TPostsInfo } from '@/stores/share-post';

const Posts = () => {
    const { data, isLoading } = useFetchPosts();

    if (isLoading) {
        return (
            <div>
                <Skeleton />
                <Skeleton />
                <Skeleton />
            </div>
        );
    }

    return <div>{data?.length !== 0 && data?.map((post) => <PostCard key={post.postId} {...post} />)}</div>;
};

export default Posts;
