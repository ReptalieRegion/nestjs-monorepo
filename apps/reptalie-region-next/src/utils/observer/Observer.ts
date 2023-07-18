import { PostMessageType, PostReturnType, serializeMessage } from '@reptalieregion/webview-bridge';

interface ObserverCallback {
    success: (data: unknown) => void;
    fail: (error: unknown) => void;
}

interface Subject {
    registerObserver(props: Pick<PostMessageType, 'module' | 'command'>): void;
    notifyObservers(data: PostReturnType): void;
}

export default class ConcreteSubject implements Subject {
    private observers: { [key: string]: ObserverCallback } = {};

    postMessage(message: PostMessageType) {
        const serializedMessage = serializeMessage(message);
        if (window && window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(serializedMessage);
        }
    }

    registerObserver(message: Pick<PostMessageType, 'module' | 'command'>) {
        return new Promise<any>((resolve, reject) => {
            this.observers[`${message.module}.${message.command}`] = {
                success: (data: any) => resolve(data),
                fail: (error) => reject(error),
            };
        });
    }

    notifyObservers({ module, command, data }: PostReturnType) {
        const functions = this.observers[`${module}.${command}`];

        if (functions) {
            const { fail, success } = functions;
            data ? success(data) : fail('no value');
        }
    }
}
