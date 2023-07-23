import { NextJSPostMessageType } from '@reptalieregion/webview-bridge';
import NextJSNavigationRunner from '../navigation/NextJSNavigationRunner';
import { IRouterContextValue } from '@/contexts/router/RouterContext';

interface IWebviewBridgeRunner {
    message: NextJSPostMessageType;
    router: IRouterContextValue;
}

const WebviewBridgeRunner = async ({ message, router }: IWebviewBridgeRunner) => {
    const { module } = message;

    try {
        if (module === 'NextJSNavigation') {
            return NextJSNavigationRunner({ message, router });
        }

        throw new Error('not found module');
    } catch (error) {
        throw error;
    }
};

export default WebviewBridgeRunner;
