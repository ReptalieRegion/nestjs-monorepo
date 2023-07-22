import { FunctionArguments, PromiseType, Unbox, VoidTypeChange } from '../../common';
import { IAsyncStorage, IHaptic, INavigation } from '../../react-native';

export const RN_MODULES = ['Haptic', 'Navigation', 'AsyncStorage'];

export type TRNBridge = {
    Haptic: IHaptic;
    Navigation: INavigation;
    AsyncStorage: IAsyncStorage;
};

export type TRNBridgeModule = keyof TRNBridge;

export type TRNBridgeCommand<Module extends TRNBridgeModule> = keyof TRNBridge[Module];

export type TRNBridgeDataType<Module extends TRNBridgeModule, Command extends TRNBridgeCommand<Module>> = FunctionArguments<
    TRNBridge[Module][Command]
>[0];

export type TRNBridgeReturnType<Module extends TRNBridgeModule, Command extends TRNBridgeCommand<Module>> = VoidTypeChange<
    PromiseType<ReturnType<TRNBridge[Module][Command]>>
>;

export type TRNBridgeCommandData = {
    [Module in TRNBridgeModule]: {
        [Command in TRNBridgeCommand<Module>]: {
            module: Module;
            command: Command;
            payload: TRNBridgeDataType<Module, Command>;
        };
    };
};

export type TRNBridgeCommandReturn = {
    [Module in TRNBridgeModule]: {
        [Command in TRNBridgeCommand<Module>]: {
            module: Module;
            command: Command;
            payload: TRNBridgeReturnType<Module, Command>;
        };
    };
};

export type RNMessageType<T extends keyof TRNBridgeCommandData> = Unbox<{
    [K in keyof TRNBridgeCommandData[T]]: TRNBridgeCommandData[T][keyof TRNBridgeCommandData[T]];
}>;

export type RNReturnMessageType<T extends keyof TRNBridgeCommandData> = Unbox<{
    [K in keyof TRNBridgeCommandReturn[T]]: TRNBridgeCommandReturn[T][keyof TRNBridgeCommandReturn[T]];
}>;

export type RNPostMessageType = Unbox<{
    [K in keyof TRNBridgeCommandData]: TRNBridgeCommandData[K][keyof TRNBridgeCommandData[K]];
}>;

export type RNPostReturnType = Unbox<{
    [K in keyof TRNBridgeCommandReturn]: TRNBridgeCommandReturn[K][keyof TRNBridgeCommandReturn[K]];
}>;
