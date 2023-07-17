import { INavigate, serializeMessage } from '@reptalieregion/webview-bridge';

export const Navigate: INavigate = {
    push: (payload) => {
        const message = serializeMessage({ module: 'Navigation', command: 'push', data: payload });
        window.ReactNativeWebView.postMessage(message);
    },
};
