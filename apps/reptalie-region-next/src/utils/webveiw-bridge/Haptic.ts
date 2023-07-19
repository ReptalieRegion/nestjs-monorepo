import { IHapticInterface } from '@reptalieregion/webview-bridge';
import ConcreteSubject from '../observer/Observer';

export const Haptic = (observer: ConcreteSubject): IHapticInterface => {
    const { postMessage } = observer.createAndRegisterObserver('Haptic');

    return {
        trigger: (payload) => {
            postMessage({ command: 'trigger', payload });
        },
    };
};
