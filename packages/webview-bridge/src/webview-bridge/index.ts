import { IHapticInterface } from '../react-native-haptic-feedback';
import { INavigate } from '../react-navigation';

type CommandPayloadType = {
    Haptic: IHapticInterface;
    Navigation: INavigate;
};

type FunctionArguments<T> = T extends (...args: infer A) => unknown ? A : never;

type PostMessageType<
    ModuleType extends keyof CommandPayloadType = keyof CommandPayloadType,
    CommandType extends keyof CommandPayloadType[ModuleType] = keyof CommandPayloadType[ModuleType],
> = {
    module: ModuleType;
    command: CommandType;
    data: FunctionArguments<CommandPayloadType[ModuleType][CommandType]>[0];
};

export const serialize = <
    ModuleType extends keyof CommandPayloadType,
    CommandType extends keyof CommandPayloadType[ModuleType],
>(
    module: ModuleType,
    command: CommandType,
    data: FunctionArguments<CommandPayloadType[ModuleType][CommandType]>[0],
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
