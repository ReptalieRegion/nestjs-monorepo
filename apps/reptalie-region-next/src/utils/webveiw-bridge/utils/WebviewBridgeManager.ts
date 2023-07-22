import {
    RNPostMessageType,
    RNPostReturnType,
    TRNBridgeCommand,
    TRNBridgeModule,
    TRNBridgeReturnType,
    serializeNextJSCall,
} from '@reptalieregion/webview-bridge';

export type Observers = {
    [key: string]: {
        success: (payload: unknown) => void;
        fail: (error: unknown) => void;
    };
};

type ModuleAndCommand<Module extends TRNBridgeModule, Command extends TRNBridgeCommand<Module>> = {
    module: Module;
    command: Command;
};

interface IWebviewBridgeManager {
    postMessage(message: RNPostMessageType): void;
    notifyObservers(message: RNPostReturnType): void;
    registerObserver<
        Module extends TRNBridgeModule = TRNBridgeModule,
        Command extends TRNBridgeCommand<Module> = TRNBridgeCommand<Module>,
    >({
        module,
        command,
    }: ModuleAndCommand<Module, Command>): Promise<unknown>;
}

export default class WebviewBridgeManager implements IWebviewBridgeManager {
    private observers: Observers = {};

    notifyObservers(message: RNPostReturnType) {
        const functions = this.observers[`${message.module}.${message.command}`];

        if (functions) {
            const { fail, success } = functions;
            message.payload ? success(message.payload) : fail('no value');
        }
    }

    postMessage(message: RNPostMessageType) {
        const serializedMessage = serializeNextJSCall(message);
        if (window && window.ReactNativeWebView && serializedMessage) {
            window.ReactNativeWebView.postMessage(serializedMessage);
        }
    }

    registerObserver<
        Module extends TRNBridgeModule = TRNBridgeModule,
        Command extends TRNBridgeCommand<Module> = TRNBridgeCommand<Module>,
    >({ module, command }: ModuleAndCommand<Module, Command>) {
        return new Promise<TRNBridgeReturnType<Module, Command>>((resolve, reject) => {
            this.observers[`${module}.${String(command)}`] = {
                success: (payload: any) => resolve(payload),
                fail: (error) => reject(error),
            };
        });
    }
}
