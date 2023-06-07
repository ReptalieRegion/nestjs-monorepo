'use client';

import PostCard from './PostCard';
import { useFetchPosts } from '@/react-query/home/share/client/hooks';

const Posts = () => {
    const { data, isLoading } = useFetchPosts();

    if (isLoading) {
        return <div>로딩</div>;
    }

    return <div>{data?.length !== 0 && data?.map((post) => <PostCard key={post.postId} {...post} />)}</div>;
};

export default Posts;
