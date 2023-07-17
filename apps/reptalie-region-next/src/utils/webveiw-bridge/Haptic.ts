import { IHapticInterface, serializeMessage } from '@reptalieregion/webview-bridge';

export const Haptic: IHapticInterface = {
    trigger: (payload) => {
        const message = serializeMessage({ module: 'Haptic', command: 'trigger', data: payload });
        window.ReactNativeWebView.postMessage(message);
    },
};
