import { FunctionArguments } from '../common/function';
import { IAsyncStorage } from '../react-native-async-storage';
import { IHapticInterface } from '../react-native-haptic-feedback';
import { INavigate } from '../react-navigation';

const WEBVIEW_BRIDGES = ['Haptic', 'Navigation', 'AsyncStorage'];

export type TWebviewBridge = {
    Haptic: IHapticInterface;
    Navigation: INavigate;
    AsyncStorage: IAsyncStorage;
};

type TWebviewBridgeCommandData = {
    [Module in keyof TWebviewBridge]: {
        [Command in keyof TWebviewBridge[Module]]: {
            module: Module;
            command: Command;
            data: FunctionArguments<TWebviewBridge[Module][Command]>[0];
        };
    };
};

type PromiseType<T> = T extends Promise<infer U> ? U : T;

type TWebviewBridgeCommandReturn = {
    [Module in keyof TWebviewBridge]: {
        [Command in keyof TWebviewBridge[Module]]: {
            module: Module;
            command: Command;
            data: PromiseType<ReturnType<TWebviewBridge[Module][Command]>>;
        };
    };
};

type Unbox<T> = T extends { [K in keyof T]: infer U } ? U : never;

type PostReturnType = Unbox<{
    [K in keyof TWebviewBridgeCommandReturn]: TWebviewBridgeCommandReturn[K][keyof TWebviewBridgeCommandReturn[K]];
}>;

type PostMessageType = Unbox<{
    [K in keyof TWebviewBridgeCommandData]: TWebviewBridgeCommandData[K][keyof TWebviewBridgeCommandData[K]];
}>;

type MessageType<T extends keyof TWebviewBridgeCommandData> = Unbox<{
    [K in keyof TWebviewBridgeCommandData[T]]: TWebviewBridgeCommandData[T][keyof TWebviewBridgeCommandData[T]];
}>;

type ReturnMessageType<T extends keyof TWebviewBridgeCommandData> = Unbox<{
    [K in keyof TWebviewBridgeCommandReturn[T]]: TWebviewBridgeCommandReturn[T][keyof TWebviewBridgeCommandReturn[T]];
}>;

export type AsyncStorageMessageType = MessageType<'AsyncStorage'>;
export type AsyncStorageReturnType = ReturnMessageType<'AsyncStorage'>;

export type NavigationMessageType = MessageType<'Navigation'>;

export type HapticMessageType = MessageType<'Haptic'>;

export const serializeReturnMessage = ({ module, command, data }: PostReturnType) => {
    const message = { module, command, data };

    return JSON.stringify(message);
};

export const serializeMessage = ({ module, command, data }: PostMessageType) => {
    const message = { module, command, data };

    return JSON.stringify(message);
};

const deserialize = <T>(messageStr: string): T | null => {
    try {
        const message = JSON.parse(messageStr);

        if (message && message?.module && message.module in WEBVIEW_BRIDGES) {
            return message as T;
        }
    } catch {
        console.error('Error parsing message string:', messageStr);
    }

    return null;
};

export const deserializeMessage = (messageStr: string): PostMessageType | null => {
    return deserialize<PostMessageType>(messageStr);
};

export const deserializeReturnMessage = (messageStr: string): PostReturnType | null => {
    return deserialize<PostReturnType>(messageStr);
};
