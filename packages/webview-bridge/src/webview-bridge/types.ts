import { FunctionArguments } from '../common/types';
import { IAsyncStorage } from '../react-native-async-storage/types';
import { IHapticInterface } from '../react-native-haptic-feedback/types';
import { INavigate } from '../react-navigation/types';

export type TWebviewBridgeCommandData = {
    [Module in keyof TWebviewBridge]: {
        [Command in keyof TWebviewBridge[Module]]: {
            module: Module;
            command: Command;
            data: FunctionArguments<TWebviewBridge[Module][Command]>[0];
        };
    };
};

export type PromiseType<T> = T extends Promise<infer U> ? U : T;

export type TWebviewBridgeCommandReturn = {
    [Module in keyof TWebviewBridge]: {
        [Command in keyof TWebviewBridge[Module]]: {
            module: Module;
            command: Command;
            data: PromiseType<ReturnType<TWebviewBridge[Module][Command]>>;
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
