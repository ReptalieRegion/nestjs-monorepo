import { IAsyncStorage } from '@reptalieregion/webview-bridge';
import WebviewBridgeManager from '../../utils/WebviewBridgeManager';

export const AsyncStorage = (observer: WebviewBridgeManager): IAsyncStorage => {
    return {
        getItem: async (payload) => {
            observer.postMessage({ module: 'AsyncStorage', command: 'getItem', payload });
            return observer.registerObserver({ module: 'AsyncStorage', command: 'getItem' });
        },
        setItem: async (payload) => {
            observer.postMessage({ module: 'AsyncStorage', command: 'setItem', payload });
        },
        removeItem: async (payload) => {
            observer.postMessage({ module: 'AsyncStorage', command: 'removeItem', payload });
        },
        clear: async () => {
            observer.postMessage({ module: 'AsyncStorage', command: 'clear', payload: undefined });
        },
        getAllKeys: async () => {
            return observer.registerObserver({ module: 'AsyncStorage', command: 'getAllKeys' });
        },
        mergeItem: async (payload) => {
            observer.postMessage({ module: 'AsyncStorage', command: 'mergeItem', payload });
        },
        multiGet: async (payload) => {
            observer.postMessage({ module: 'AsyncStorage', command: 'multiGet', payload });
            return observer.registerObserver({ module: 'AsyncStorage', command: 'multiGet' });
        },
        multiMerge: async (payload) => {
            observer.postMessage({ module: 'AsyncStorage', command: 'multiMerge', payload });
        },
        multiRemove: async (payload) => {
            observer.postMessage({ module: 'AsyncStorage', command: 'multiRemove', payload });
        },
        multiSet: async (payload) => {
            observer.postMessage({ module: 'AsyncStorage', command: 'multiSet', payload });
        },
    };
};
