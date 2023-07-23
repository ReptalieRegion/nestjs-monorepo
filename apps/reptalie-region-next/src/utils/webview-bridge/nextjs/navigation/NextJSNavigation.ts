import { IRouterContextValue } from '@/contexts/router/RouterContext';
import {
    INextJSNavigation,
    TNextJSNAvigationPrefetch,
    TNextJSNavigationPush,
    TNextJSNavigationReplace,
} from '@reptalieregion/webview-bridge';

const NextJSNavigation = (router: IRouterContextValue): INextJSNavigation => {
    return {
        push: (payload: TNextJSNavigationPush): void => {
            const { href, options } = payload;
            router.push(href, options);
        },
        back: (): void => {
            router.back();
        },
        replace: (payload: TNextJSNavigationReplace): void => {
            const { href, options } = payload;
            router.replace(href, options);
        },
        prefetch: (payload: TNextJSNAvigationPrefetch): void => {
            const { url, options } = payload;
            router.prefetch(url, options);
        },
    };
};

export default NextJSNavigation;
