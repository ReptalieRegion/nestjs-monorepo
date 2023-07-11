'use client';

import Skeleton from '../atoms/Skeleton';
import FloatingActionButtons from '../molecules/FloatingActionButtons';
import PostCard from '../organisms/PostCard';
import { useFetchPosts } from '@/react-query/home/share/client/hooks';

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

    return (
        <div>
            {data?.length !== 0 && data?.map((post) => <PostCard key={post.postId} {...post} />)}
            <FloatingActionButtons />
        </div>
    );
};

export default Posts;
