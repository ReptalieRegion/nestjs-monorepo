import { IRouterContextValue } from '@/contexts/router/RouterContext';
import { NextJSNavigationMessageType, NextJSNavigationReturnType } from '@reptalieregion/webview-bridge';
import NextJSNavigation from './NextJSNavigation';

interface INextJSNavigationRunnerProps {
    message: NextJSNavigationMessageType;
    router: IRouterContextValue;
}

const NextJSNavigationRunner = ({ router, message }: INextJSNavigationRunnerProps): NextJSNavigationReturnType => {
    const { module, command, payload } = message;
    const nextJSNavigation = NextJSNavigation(router);

    switch (command) {
        case 'push':
            nextJSNavigation.push(payload);
            return { module, command, payload: undefined };
        case 'back':
            nextJSNavigation.back(payload);
            return { module, command, payload: undefined };
        case 'replace':
            nextJSNavigation.replace(payload);
            return { module, command, payload: undefined };
        case 'prefetch':
            nextJSNavigation.prefetch(payload);
            return { module, command, payload: undefined };
        default:
            throw new Error('[webview-bridge] not found NextJSNavigation command');
    }
};

export default NextJSNavigationRunner;
