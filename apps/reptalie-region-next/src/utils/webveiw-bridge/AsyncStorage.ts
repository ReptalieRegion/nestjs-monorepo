import { IAsyncStorage } from '@reptalieregion/webview-bridge';
import WebviewBridgeManager from './utils/WebviewBridgeManager';

export const AsyncStorage = (observer: WebviewBridgeManager): IAsyncStorage => {
    const { postMessage, registerObserver } = observer.createObserverAndPostMessage('AsyncStorage');

    return {
        getItem: async (payload) => {
            postMessage({ command: 'getItem', payload });
            return registerObserver('getItem');
        },
        setItem: async (payload) => {
            postMessage({ command: 'setItem', payload });
        },
        removeItem: async (payload) => {
            postMessage({ command: 'removeItem', payload });
        },
        clear: async () => {
            postMessage({ command: 'clear', payload: undefined });
        },
        getAllKeys: async () => {
            return registerObserver('getAllKeys');
        },
        mergeItem: async (payload) => {
            postMessage({ command: 'mergeItem', payload });
        },
        multiGet: async (payload) => {
            postMessage({ command: 'multiGet', payload });
            return registerObserver('multiGet');
        },
        multiMerge: async (payload) => {
            postMessage({ command: 'multiMerge', payload });
        },
        multiRemove: async (payload) => {
            postMessage({ command: 'multiRemove', payload });
        },
        multiSet: async (payload) => {
            postMessage({ command: 'multiSet', payload });
        },
    };
};
