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
            const { href } = payload;
            router.replace(href);
        },
        prefetch: (payload: TNextJSNAvigationPrefetch): void => {
            const { url } = payload;
            router.prefetch(url);
        },
    };
};

export default NextJSNavigation;
