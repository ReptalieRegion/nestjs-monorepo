import { IHapticInterface, serializeMessage } from '@reptalieregion/webview-bridge';
import ConcreteSubject from '../observer/Observer';

export const Haptic = (observer: ConcreteSubject): IHapticInterface => {
    return {
        trigger: (payload) => {
            observer.postMessage({ module: 'Haptic', command: 'trigger', data: payload });
        },
    };
};
