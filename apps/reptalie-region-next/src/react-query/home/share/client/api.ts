import { TFollow } from '<API>';
import clientFetch from '../../../clientFetch';

export const getPosts = async () => {
    const response = await clientFetch('api/posts');
    return response.json();
};

export const updateFollow = async (data: TFollow) => {
    const response = await clientFetch('api/posts/follow', {
        method: 'POST',
        body: data,
    });
    return response.json;
};

export const getDetailPosts = async (userId: string) => {
    const response = await clientFetch(`api/posts/${userId}`);

    return response.json();
};
