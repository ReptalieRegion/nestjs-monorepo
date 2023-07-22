import { BridgeFunction, NotExistsArguments } from '../../common';

interface NavigateOptions {}

export type TNextJSNavigationPush = {
    href: string;
    options?: NavigateOptions;
};

export type TNextJSNavigationReplace = {
    href: string;
};

export type TNextJSNAvigationPrefetch = {
    url: string;
};

export interface INextJSNavigation {
    push: BridgeFunction<TNextJSNavigationPush, void>;
    back: BridgeFunction<NotExistsArguments, void>;
    replace: BridgeFunction<TNextJSNavigationReplace, void>;
    prefetch: BridgeFunction<TNextJSNAvigationPrefetch, void>;
}
