import clientFetch from '../../../clientFetch';

export const getPosts = async () => {
    const response = await clientFetch('api/users/posts');
    const data = response.json();
    return data;
};
