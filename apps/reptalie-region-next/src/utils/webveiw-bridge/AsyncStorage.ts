import { AsyncStorageMessageType, IAsyncStorage, TWebviewBridge } from '@reptalieregion/webview-bridge';
import ConcreteSubject from '../observer/Observer';

export const AsyncStorage = (observer: ConcreteSubject): IAsyncStorage => {
    const postMessage = (command: keyof TWebviewBridge['AsyncStorage'], data?: any) => {
        observer.postMessage({ module: 'AsyncStorage', command, data });
    };

    const registerObserver = ({ command }: Pick<AsyncStorageMessageType, 'command'>) => {
        return observer.registerObserver({ module: 'AsyncStorage', command });
    };

    return {
        getItem: async (payload) => {
            postMessage('getItem', payload);
            const result = registerObserver({ command: 'getItem' });
            return result;
        },
        setItem: async (payload) => {
            postMessage('setItem', payload);
        },
        removeItem: async (payload) => {
            postMessage('removeItem', payload);
        },
        clear: async () => {
            postMessage('clear');
        },
        getAllKeys: async () => {
            return registerObserver({ command: 'getAllKeys' });
        },
        mergeItem: async (payload) => {
            postMessage('mergeItem', payload);
        },
        multiGet: async (payload) => {
            postMessage('multiGet', payload);
            return registerObserver({ command: 'multiGet' });
        },
        multiMerge: async (payload) => {
            postMessage('multiMerge', payload);
        },
        multiRemove: async (payload) => {
            postMessage('multiRemove', payload);
        },
        multiSet: async (payload) => {
            postMessage('multiSet', payload);
        },
    };
};
