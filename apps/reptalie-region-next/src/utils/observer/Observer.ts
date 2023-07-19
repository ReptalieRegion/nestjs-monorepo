import {
    PostReturnType,
    TWebviewBridgeCommand,
    TWebviewBridgeDataType,
    TWebviewBridgeModule,
    TWebviewBridgeReturnType,
    TWebviewBridgeSerializeMessage,
    serializeMessage,
} from '@reptalieregion/webview-bridge';

type ModuleAndCommand<Module extends TWebviewBridgeModule, Command extends TWebviewBridgeCommand<Module>> = {
    module: Module;
    command: Command;
};

interface Observers {
    [key: string]: {
        success: (payload: unknown) => void;
        fail: (error: unknown) => void;
    };
}

interface Subject {
    createAndRegisterObserver<Module extends TWebviewBridgeModule>(
        module: Module,
    ): {
        registerObserver: <Command extends TWebviewBridgeCommand<Module>>(
            command: Command,
        ) => Promise<TWebviewBridgeReturnType<Module, Command>>;
        postMessage: <Command extends TWebviewBridgeCommand<Module>>({
            command,
            payload,
        }: {
            command: Command;
            payload: TWebviewBridgeDataType<Module, Command>;
        }) => void;
    };

    notifyObservers(message: PostReturnType): void;
}

export default class ConcreteSubject implements Subject {
    private observers: Observers = {};

    postMessage<Module extends TWebviewBridgeModule, Command extends TWebviewBridgeCommand<Module>>(
        message: TWebviewBridgeSerializeMessage<Module, Command>,
    ) {
        const serializedMessage = serializeMessage(message);
        if (window && window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(serializedMessage);
        }
    }

    createAndRegisterObserver<Module extends TWebviewBridgeModule>(module: Module) {
        return {
            registerObserver: <Command extends TWebviewBridgeCommand<Module>>(command: Command) =>
                this.registerObserver({ module, command }),
            postMessage: <Command extends TWebviewBridgeCommand<Module>>({
                command,
                payload,
            }: {
                command: Command;
                payload: TWebviewBridgeDataType<Module, Command>;
            }) => {
                this.postMessage({ module, command, payload });
            },
        };
    }

    notifyObservers({ module, command, payload }: PostReturnType) {
        const functions = this.observers[`${module}.${command}`];

        if (functions) {
            const { fail, success } = functions;
            payload ? success(payload) : fail('no value');
        }
    }

    private registerObserver<Module extends TWebviewBridgeModule, Command extends TWebviewBridgeCommand<Module>>({
        module,
        command,
    }: ModuleAndCommand<Module, Command>) {
        return new Promise<TWebviewBridgeReturnType<Module, Command>>((resolve, reject) => {
            if (typeof command === 'string') {
                this.observers[`${module}.${command}`] = {
                    success: (payload: any) => resolve(payload),
                    fail: (error) => reject(error),
                };
            }
        });
    }
}
