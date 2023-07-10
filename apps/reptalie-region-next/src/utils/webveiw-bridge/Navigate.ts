import { INavigate, serialize } from '@reptalieregion/webview-bridge';

export const Navigate: INavigate = {
    push: (payload) => {
        const message = serialize('Navigation', 'push', payload);
        window.ReactNativeWebView.postMessage(message);
    },
};
