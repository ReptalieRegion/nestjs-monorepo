import { IHapticInterface, serialize } from '@reptalieregion/webview-bridge';

export const Haptic: IHapticInterface = {
    trigger: (payload) => {
        const message = serialize('Haptic', 'trigger', payload);
        window.ReactNativeWebView.postMessage(message);
    },
};
