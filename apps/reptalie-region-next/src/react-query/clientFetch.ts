type TMethod = 'GET' | 'POST' | 'DELETE' | 'PUT';

interface IRequestInit extends Omit<RequestInit, 'method'> {
    method?: TMethod;
    ignorePrefix?: boolean;
}

const PREFIX_URI = process.env.API_URL ?? 'http://localhost:3333/';

const clientFetch = async (input: RequestInfo | URL, init?: IRequestInit): Promise<Response> => {
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
        const { worker } = await import('../mocks/browser');
        worker.start();
    }
    const method = init?.method ?? 'GET';
    const url = init?.ignorePrefix ? input : PREFIX_URI + input;
    delete init?.ignorePrefix;

    return fetch(url, {
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        method,
        ...init,
    });
};

export default clientFetch;
