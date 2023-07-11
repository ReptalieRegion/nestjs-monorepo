type TMethod = 'GET' | 'POST' | 'DELETE' | 'PUT';

interface IRequestInit extends Omit<RequestInit, 'method' | 'body'> {
    method?: TMethod;
    body?: object;
    ignorePrefix?: boolean;
}

const PREFIX_URI = process.env.API_URL ?? 'http://localhost:3333/';
const DEFAULT_HEADER: HeadersInit = {
    'Content-Type': 'application/json',
};

const clientFetch = async (input: RequestInfo | URL, init?: IRequestInit): Promise<Response> => {
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
        const { worker } = await import('../mocks/browser');
        worker.start();
    }

    const url = init?.ignorePrefix ? input : PREFIX_URI + input;
    delete init?.ignorePrefix;
    const newMethod = init?.method ?? 'GET';
    const newBody = init?.body ? JSON.stringify(init.body) : undefined;
    const newHeaders = { ...DEFAULT_HEADER, ...init?.headers };
    const newCredentials = init?.credentials ? init.credentials : 'include';
    const newInit: RequestInit = {
        ...init,
        headers: newHeaders,
        credentials: newCredentials,
        method: newMethod,
        body: newBody,
    };

    const response = await fetch(url, newInit);

    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
        const { worker } = await import('../mocks/browser');
        worker.stop();
    }

    return response;
};

export default clientFetch;
