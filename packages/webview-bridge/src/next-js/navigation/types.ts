import { BridgeFunction, NotExistsArguments } from '../../common';

interface NavigateOptions {}

enum PrefetchKind {
    AUTO = 'auto',
    FULL = 'full',
    TEMPORARY = 'temporary',
}

interface PrefetchOptions {
    kind: PrefetchKind;
}

export type TNextJSNavigationPush = {
    href: string;
    options?: NavigateOptions;
};

export type TNextJSNavigationReplace = {
    href: string;
    options?: NavigateOptions;
};

export type TNextJSNAvigationPrefetch = {
    url: string;
    options?: PrefetchOptions;
};

export interface INextJSNavigation {
    push: BridgeFunction<TNextJSNavigationPush, void>;
    back: BridgeFunction<NotExistsArguments, void>;
    replace: BridgeFunction<TNextJSNavigationReplace, void>;
    prefetch: BridgeFunction<TNextJSNAvigationPrefetch, void>;
}
