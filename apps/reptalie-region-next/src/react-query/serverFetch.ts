'use server';
import { parseCookies } from '@/utils/network/cookie';
import { cookies } from 'next/headers';

type TMethod = 'GET' | 'POST' | 'DELETE' | 'PUT';

interface IRequestInit extends Omit<RequestInit, 'method'> {
    method?: TMethod;
    ignorePrefix?: boolean;
}

const PREFIX_URI = process.env.API_URL ?? 'http://localhost:3333/';

const customFetch = async (input: RequestInfo | URL, init?: IRequestInit): Promise<Response> => {
    const method = init?.method ?? 'GET';
    const url = init?.ignorePrefix ? input : PREFIX_URI + input;
    delete init?.ignorePrefix;
    const cookieStore = cookies();
    const accessToken = cookieStore.get('access_token');
    const refreshToken = cookieStore.get('refresh_token');

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            Cookie: `access_token=${accessToken?.value};refresh_token=${refreshToken?.value};`,
        },
        cache: 'no-store',
        credentials: 'include',
        method,
        ...init,
    });

    const cookie = response.headers.get('set-cookie');
    if (cookie) {
        const cookiePairs = parseCookies(cookie);
        setCookie(cookiePairs);
    }

    return response;
};

async function setCookie(cookiePairs: any) {
    'use server';
    for (const cookie of cookiePairs) {
        const { key, value } = cookie;
        cookies().set(key, value, {
            httpOnly: true,
        });
    }
}

export default customFetch;
