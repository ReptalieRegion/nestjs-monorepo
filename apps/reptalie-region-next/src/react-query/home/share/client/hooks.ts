import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getPosts, updateFollow } from './api';
import { IPostsData } from '<API>';

export const useFetchPosts = () => {
    return useQuery<IPostsData[]>({ queryKey: ['fetchPosts'], queryFn: getPosts });
};

export const useUpdateFollow = () => {
    const queryClient = useQueryClient();
    return useMutation(updateFollow, {
        onSuccess: () => {
            queryClient.invalidateQueries(['fetchPosts']);
        },
    });
};
