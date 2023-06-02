import customFetch from '../customFetch';

export const getPosts = async () => {
    return customFetch('api/users/posts').then((res) => res.json());
};
