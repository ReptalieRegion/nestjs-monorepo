import { IAsyncStorage, serializeMessage } from '@reptalieregion/webview-bridge';
import ConcreteSubject from '../observer/Observer';

export const AsyncStorage = (observer: ConcreteSubject): IAsyncStorage => {
    return {
        clear: async () => {
            const message = serializeMessage({ module: 'AsyncStorage', command: 'clear', data: undefined });
            window.ReactNativeWebView.postMessage(message);
        },
        getAllKeys: async () => {
            const message = serializeMessage({ module: 'AsyncStorage', command: 'getAllKeys', data: undefined });

            window.ReactNativeWebView.postMessage(message);

            return new Promise((resolve, reject) => {
                observer.registerObserver('AsyncStorage', 'getAllKeys', {
                    success: (data) => resolve(data),
                    fail: (error) => reject(error),
                });
            });
        },
        getItem: async (payload) => {
            const message = serializeMessage({ module: 'AsyncStorage', command: 'getItem', data: payload });
            window.ReactNativeWebView.postMessage(message);
            return new Promise((resolve, reject) => {
                observer.registerObserver('AsyncStorage', 'getItem', {
                    success: (data) => resolve(data),
                    fail: (error) => reject(error),
                });
            });
        },
        setItem: async (payload) => {
            const message = serializeMessage({ module: 'AsyncStorage', command: 'setItem', data: payload });
            window.ReactNativeWebView.postMessage(message);
        },
        mergeItem: async (payload) => {
            const message = serializeMessage({ module: 'AsyncStorage', command: 'mergeItem', data: payload });
            window.ReactNativeWebView.postMessage(message);
        },
        removeItem: async (payload) => {
            const message = serializeMessage({ module: 'AsyncStorage', command: 'removeItem', data: payload });
            window.ReactNativeWebView.postMessage(message);
        },
        multiGet: async (payload) => {
            const message = serializeMessage({ module: 'AsyncStorage', command: 'multiGet', data: payload });
            window.ReactNativeWebView.postMessage(message);
            return new Promise((resolve, reject) => {
                observer.registerObserver('AsyncStorage', 'multiGet', {
                    success: (data) => resolve(data),
                    fail: (error) => reject(error),
                });
            });
        },
        multiMerge: async (payload) => {
            const message = serializeMessage({ module: 'AsyncStorage', command: 'multiMerge', data: payload });
            window.ReactNativeWebView.postMessage(message);
        },
        multiRemove: async (payload) => {
            const message = serializeMessage({ module: 'AsyncStorage', command: 'multiRemove', data: payload });
            window.ReactNativeWebView.postMessage(message);
        },
        multiSet: async (payload) => {
            const message = serializeMessage({ module: 'AsyncStorage', command: 'multiSet', data: payload });
            window.ReactNativeWebView.postMessage(message);
        },
    };
};
