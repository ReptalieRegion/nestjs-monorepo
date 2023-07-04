import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getDetailPosts, getPosts, updateFollow } from './api';
import { IDetailPostsData, IPostsData } from '<API>';

export const useFetchPosts = () => {
    return useQuery<IPostsData[]>({ queryKey: ['fetchPosts'], queryFn: getPosts, staleTime: Infinity });
};

export const useUpdateFollow = () => {
    const queryClient = useQueryClient();
    return useMutation(updateFollow, {
        onSuccess: () => {
            queryClient.invalidateQueries(['fetchPosts']);
        },
    });
};

export const useFetchDetailPosts = (userId: string) => {
    return useQuery<IDetailPostsData>({ queryKey: ['fetchDetailPosts'], queryFn: () => getDetailPosts(userId) });
};
