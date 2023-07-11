interface ICookie {
    key: string;
    value: string;
    options: unknown;
}

export const parseCookies = (cookies: string) => {
    const cookiePairs = cookies.split(',');
    const array: ICookie[] = new Array<ICookie>();
    const cookieDetailPairs = cookiePairs.reduce((prev, cookie) => {
        const [cookieMain, ...cookieOptions] = cookie.split(';');
        const [cookieName, cookieValue] = cookieMain.split('=');
        const cookieOptionsPairs = parseCookieOptions(cookieOptions);

        return [
            ...prev,
            {
                key: cookieName,
                value: cookieValue,
                options: cookieOptionsPairs,
            },
        ];
    }, array);

    return cookieDetailPairs;
};

const parseCookieOptions = (cookieOptions: string[]) => {
    return cookieOptions;
};
