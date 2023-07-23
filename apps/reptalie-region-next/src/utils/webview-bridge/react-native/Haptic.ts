import { IHaptic } from '@reptalieregion/webview-bridge';
import WebviewBridgeManager from '../utils/WebviewBridgeManager';

export const Haptic = (observer: WebviewBridgeManager): IHaptic => {
    return {
        trigger: (payload) => {
            observer.postMessage({ module: 'Haptic', command: 'trigger', payload });
        },
    };
};
