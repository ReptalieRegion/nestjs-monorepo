import { INavigate, serializeMessage } from '@reptalieregion/webview-bridge';
import ConcreteSubject from '../observer/Observer';

export const Navigate = (observer: ConcreteSubject): INavigate => {
    return {
        push: (payload) => {
            observer.postMessage({ module: 'Navigation', command: 'push', data: payload });
        },
    };
};
