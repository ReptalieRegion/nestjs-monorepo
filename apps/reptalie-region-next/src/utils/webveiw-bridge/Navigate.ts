import { INavigate } from '@reptalieregion/webview-bridge';
import WebviewBridgeManager from './utils/WebviewBridgeManager';

export const Navigate = (observer: WebviewBridgeManager): INavigate => {
    const { postMessage } = observer.createObserverAndPostMessage('Navigation');

    return {
        push: (payload) => {
            postMessage({ command: 'push', payload });
        },
    };
};
