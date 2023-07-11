import { IAsyncStorage } from '../react-native-async-storage';
import { IHapticInterface } from '../react-native-haptic-feedback';
import { INavigate } from '../react-navigation';

export type TWebviewBridge = {
    Haptic: IHapticInterface;
    Navigation: INavigate;
    AsyncStorage: IAsyncStorage;
};

export type FunctionArguments<T> = T extends (...args: infer A) => unknown ? A : never;

export type PostMessageType<
    ModuleType extends keyof TWebviewBridge = keyof TWebviewBridge,
    CommandType extends keyof TWebviewBridge[ModuleType] = keyof TWebviewBridge[ModuleType],
> = {
    module: ModuleType;
    command: CommandType;
    data: FunctionArguments<TWebviewBridge[ModuleType][CommandType]>[0];
};

export const serialize = <ModuleType extends keyof TWebviewBridge, CommandType extends keyof TWebviewBridge[ModuleType]>(
    module: ModuleType,
    command: CommandType,
    data: FunctionArguments<TWebviewBridge[ModuleType][CommandType]>[0],
): string => {
    const message: PostMessageType<ModuleType, CommandType> = { module, command, data };
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
