'use server';
import serverFetch from '../../../serverFetch';

export const serverGetPosts = async () => {
    const response = await serverFetch('api/users/posts');
    const data = await response.json();
    return data;
};
