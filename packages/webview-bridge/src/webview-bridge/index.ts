import { FunctionArguments } from '../common/function';
import { IAsyncStorage } from '../react-native-async-storage';
import { IHapticInterface } from '../react-native-haptic-feedback';
import { INavigate } from '../react-navigation';

export type TWebviewBridge = {
    Haptic: IHapticInterface;
    Navigation: INavigate;
    AsyncStorage: IAsyncStorage;
};

export type PostMessageType<
    ModuleType extends keyof TWebviewBridge = keyof TWebviewBridge,
    CommandType extends keyof TWebviewBridge[ModuleType] = keyof TWebviewBridge[ModuleType],
> = {
    module: ModuleType;
    command: CommandType;
    data: FunctionArguments<TWebviewBridge[ModuleType][CommandType]>[0];
};

export const createMessageSerializer = <ModuleType extends keyof TWebviewBridge>(module: ModuleType) => {
    return <CommandType extends keyof TWebviewBridge[ModuleType]>(
        command: CommandType,
        data: FunctionArguments<TWebviewBridge[ModuleType][CommandType]>[0],
    ) => serialize(module, command, data);
};

export const createMessageDeserialize = (message: string) => {
    const { module, command, data } = JSON.parse(message) as
        | PostMessageType<'AsyncStorage'>
        | PostMessageType<'Haptic'>
        | PostMessageType<'Navigation'>;

    return { module, command, data };
};

export const createReturnSerialize = <ModuleType extends keyof TWebviewBridge>(module: ModuleType) => {
    return <CommandType extends keyof TWebviewBridge[ModuleType]>(
        command: CommandType,
        data: ReturnType<TWebviewBridge[ModuleType][CommandType]>,
    ) => serialize(module, command, data);
};

export const createReturnDeserialize = () => {
    return;
};

const serialize = <ModuleType extends keyof TWebviewBridge, CommandType extends keyof TWebviewBridge[ModuleType]>(
    module: ModuleType,
    command: CommandType,
    data: FunctionArguments<TWebviewBridge[ModuleType][CommandType]>[0],
): string => {
    const message = { module, command, data };

    return JSON.stringify(message);
};

export const deserialize = (messageStr: string): PostMessageType | null => {
    try {
        return JSON.parse(messageStr) as PostMessageType;
    } catch {
        console.error('Error parsing message string:', messageStr);
        return null;
    }
};
