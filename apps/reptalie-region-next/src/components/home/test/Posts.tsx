'use client';

import clientFetch from '@/react-query/clientFetch';
import { useQuery } from '@tanstack/react-query';
import PostCard from './PostCard';
import { TImage } from '<Share>';

const fetchPosts = async () => {
    const response = await clientFetch('api/posts');
    return response.json();
};

interface IPostsData {
    userId: number;
    postId: number;
    profile: TImage;
    name: string;
    isFollow: boolean;
    content: string;
    images: TImage[];
    likeCount: number;
}

const Posts = () => {
    const { data, isLoading } = useQuery<IPostsData[]>({ queryKey: ['post'], queryFn: fetchPosts });

    if (isLoading) {
        <div>로딩</div>;
    }

    return <div>{data?.length !== 0 && data?.map((post) => <PostCard key={post.postId} {...post} />)}</div>;
};

export default Posts;
