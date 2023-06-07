import { useQuery } from '@tanstack/react-query';
import { getPosts } from './api';

export const useFetchPosts = () => {
    return useQuery({ queryKey: ['fetchPosts'], queryFn: getPosts });
};
