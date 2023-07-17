import { TWebviewBridge } from '@reptalieregion/webview-bridge';

type Observer = {
    [module in keyof TWebviewBridge]: {
        [command in keyof TWebviewBridge[module]]: ObserverCallback<any> | null;
    };
};

interface ObserverCallback<TData> {
    success: (data: TData) => void;
    fail: (error: any) => void;
}

interface Subject {
    registerObserver<
        ModuleType extends keyof TWebviewBridge = keyof TWebviewBridge,
        CommandType extends keyof TWebviewBridge[ModuleType] = keyof TWebviewBridge[ModuleType],
    >(
        module: ModuleType,
        command: CommandType,
        callback: ObserverCallback<ReturnType<TWebviewBridge[ModuleType][CommandType]>>,
    ): void;
    notifyObservers(data: any): void;
}

export default class ConcreteSubject implements Subject {
    private observers: Observer = {
        AsyncStorage: {
            clear: null,
            getAllKeys: null,
            getItem: null,
            mergeItem: null,
            multiGet: null,
            multiMerge: null,
            multiRemove: null,
            multiSet: null,
            removeItem: null,
            setItem: null,
        },
        Haptic: {
            trigger: null,
        },
        Navigation: {
            push: null,
        },
    };

    registerObserver<
        ModuleType extends keyof TWebviewBridge = keyof TWebviewBridge,
        CommandType extends keyof TWebviewBridge[ModuleType] = keyof TWebviewBridge[ModuleType],
    >(
        module: ModuleType,
        command: CommandType,
        callback: ObserverCallback<ReturnType<TWebviewBridge[ModuleType][CommandType]>>,
    ) {
        if (module === 'AsyncStorage') {
            this.observers[module as 'AsyncStorage'][command as keyof TWebviewBridge['AsyncStorage']] = callback;
            return;
        }

        if (module === 'Haptic') {
            this.observers[module as 'Haptic'][command as keyof TWebviewBridge['Haptic']] = callback;
            return;
        }

        if (module === 'Navigation') {
            this.observers[module as 'Navigation'][command as keyof TWebviewBridge['Navigation']] = callback;
            return;
        }
    }

    notifyObservers<
        ModuleType extends keyof TWebviewBridge = keyof TWebviewBridge,
        CommandType extends keyof TWebviewBridge[ModuleType] = keyof TWebviewBridge[ModuleType],
    >({ module, command, returnValue }: { module: ModuleType; command: CommandType; returnValue: unknown }) {
        const fn = this.observers[module]?.[command];
        if (fn === null) {
            return;
        }

        if (!returnValue) {
            fn?.fail('no value');
            return;
        }

        fn?.success(returnValue);
    }
}
