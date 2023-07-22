import { INavigation } from '@reptalieregion/webview-bridge';
import WebviewBridgeManager from './utils/WebviewBridgeManager';

export const Navigation = (observer: WebviewBridgeManager): INavigation => {
    return {
        push: (payload) => {
            observer.postMessage({ module: 'Navigation', command: 'push', payload });
        },
    };
};
