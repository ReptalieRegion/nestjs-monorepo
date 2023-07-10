import { dehydrate } from '@tanstack/react-query';
import getQueryClient from '@/contexts/react-query/getQueryClient';
import { serverGetPosts } from './api';

export const serverFetchPosts = async () => {
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(['fetchPosts'], serverGetPosts);
    const dehydratedState = dehydrate(queryClient);
    return dehydratedState;
};
