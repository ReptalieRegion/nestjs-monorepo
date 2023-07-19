import { IHapticInterface } from '@reptalieregion/webview-bridge';
import WebviewBridgeManager from './utils/WebviewBridgeManager';

export const Haptic = (observer: WebviewBridgeManager): IHapticInterface => {
    const { postMessage } = observer.createObserverAndPostMessage('Haptic');

    return {
        trigger: (payload) => {
            postMessage({ command: 'trigger', payload });
        },
    };
};
