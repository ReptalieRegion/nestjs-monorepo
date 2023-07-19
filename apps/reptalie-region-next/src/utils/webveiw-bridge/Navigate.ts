import { INavigate, serializeMessage } from '@reptalieregion/webview-bridge';
import ConcreteSubject from '../observer/Observer';

export const Navigate = (observer: ConcreteSubject): INavigate => {
    const { postMessage } = observer.createAndRegisterObserver('Navigation');

    return {
        push: (payload) => {
            postMessage({ command: 'push', payload });
        },
    };
};
