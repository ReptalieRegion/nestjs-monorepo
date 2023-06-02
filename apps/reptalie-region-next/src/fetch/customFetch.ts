const PREFIX_URI = 'http://localhost:3333/';

const customFetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    return fetch(PREFIX_URI + input, {
        ...init,
    });
};

export default customFetch;
