import { FunctionArguments } from '@/common';
import { IAsyncStorage, IHapticInterface, INavigate } from '@/react-native';

export type TWebviewBridgeModule = keyof TWebviewBridge;

export type TWebviewBridgeCommand<Module extends TWebviewBridgeModule> = keyof TWebviewBridge[Module];

export type TWebviewBridgeDataType<
    Module extends TWebviewBridgeModule,
    Command extends TWebviewBridgeCommand<Module>,
> = FunctionArguments<TWebviewBridge[Module][Command]>[0];

export type TWebviewBridgeReturnType<
    Module extends TWebviewBridgeModule,
    Command extends TWebviewBridgeCommand<Module>,
> = PromiseType<ReturnType<TWebviewBridge[Module][Command]>>;

export type TWebviewBridgeSerializeReturnMessage<
    Module extends TWebviewBridgeModule,
    Command extends TWebviewBridgeCommand<Module>,
> = {
    module: Module;
    command: Command;
    payload: TWebviewBridgeReturnType<Module, Command>;
};

export type TWebviewBridgeSerializeMessage<
    Module extends TWebviewBridgeModule,
    Command extends TWebviewBridgeCommand<Module>,
> = {
    module: Module;
    command: Command;
    payload: TWebviewBridgeDataType<Module, Command>;
};

export type PromiseType<T> = T extends Promise<infer U> ? U : T;

export type TWebviewBridgeCommandData = {
    [Module in TWebviewBridgeModule]: {
        [Command in TWebviewBridgeCommand<Module>]: {
            module: Module;
            command: Command;
            payload: TWebviewBridgeDataType<Module, Command>;
        };
    };
};

export type TWebviewBridgeCommandReturn = {
    [Module in TWebviewBridgeModule]: {
        [Command in TWebviewBridgeCommand<Module>]: {
            module: Module;
            command: Command;
            payload: TWebviewBridgeReturnType<Module, Command>;
        };
    };
};

export type Unbox<T> = T extends { [K in keyof T]: infer U } ? U : never;

export type MessageType<T extends keyof TWebviewBridgeCommandData> = Unbox<{
    [K in keyof TWebviewBridgeCommandData[T]]: TWebviewBridgeCommandData[T][keyof TWebviewBridgeCommandData[T]];
}>;

export type ReturnMessageType<T extends keyof TWebviewBridgeCommandData> = Unbox<{
    [K in keyof TWebviewBridgeCommandReturn[T]]: TWebviewBridgeCommandReturn[T][keyof TWebviewBridgeCommandReturn[T]];
}>;

export const WEBVIEW_BRIDGES = ['Haptic', 'Navigation', 'AsyncStorage'];

export type TWebviewBridge = {
    Haptic: IHapticInterface;
    Navigation: INavigate;
    AsyncStorage: IAsyncStorage;
};

export type PostMessageType = Unbox<{
    [K in keyof TWebviewBridgeCommandData]: TWebviewBridgeCommandData[K][keyof TWebviewBridgeCommandData[K]];
}>;
export type PostReturnType = Unbox<{
    [K in keyof TWebviewBridgeCommandReturn]: TWebviewBridgeCommandReturn[K][keyof TWebviewBridgeCommandReturn[K]];
}>;

export type AsyncStorageMessageType = MessageType<'AsyncStorage'>;
export type AsyncStorageReturnType = ReturnMessageType<'AsyncStorage'>;

export type NavigationMessageType = MessageType<'Navigation'>;
export type NavigationReturnType = ReturnMessageType<'Navigation'>;

export type HapticMessageType = MessageType<'Haptic'>;
export type HapticReturnType = ReturnMessageType<'Haptic'>;
