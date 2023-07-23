import { FunctionArguments, PromiseType, Unbox, VoidTypeChange } from '../../common';
import { INextJSNavigation } from '../../next-js/navigation';

export const NEXT_JS_MODULES = ['NextJSNavigation'];

export type TNextJSBridge = {
    NextJSNavigation: INextJSNavigation;
};

export type TNextJSBridgeModule = keyof TNextJSBridge;

export type TNextJSBridgeCommand<Module extends TNextJSBridgeModule> = keyof TNextJSBridge[Module];

export type TNextJSBridgeDataType<
    Module extends TNextJSBridgeModule,
    Command extends TNextJSBridgeCommand<Module>,
> = FunctionArguments<TNextJSBridge[Module][Command]>[0];

export type TNextJSBridgeReturnType<
    Module extends TNextJSBridgeModule,
    Command extends TNextJSBridgeCommand<Module>,
> = VoidTypeChange<PromiseType<ReturnType<TNextJSBridge[Module][Command]>>>;

export type TNextJSBridgeCommandData = {
    [Module in TNextJSBridgeModule]: {
        [Command in TNextJSBridgeCommand<Module>]: {
            module: Module;
            command: Command;
            payload: TNextJSBridgeDataType<Module, Command>;
        };
    };
};

export type TNextJSBridgeCommandReturn = {
    [Module in TNextJSBridgeModule]: {
        [Command in TNextJSBridgeCommand<Module>]: {
            module: Module;
            command: Command;
            payload: TNextJSBridgeReturnType<Module, Command>;
        };
    };
};

export type NextJSMessageType<T extends keyof TNextJSBridgeCommandData> = Unbox<{
    [K in keyof TNextJSBridgeCommandData[T]]: TNextJSBridgeCommandData[T][keyof TNextJSBridgeCommandData[T]];
}>;

export type NextJSReturnMessageType<T extends keyof TNextJSBridgeCommandData> = Unbox<{
    [K in keyof TNextJSBridgeCommandReturn[T]]: TNextJSBridgeCommandReturn[T][keyof TNextJSBridgeCommandReturn[T]];
}>;

export type NextJSPostMessageType = Unbox<{
    [K in keyof TNextJSBridgeCommandData]: TNextJSBridgeCommandData[K][keyof TNextJSBridgeCommandData[K]];
}>;
export type NextJSPostReturnType = Unbox<{
    [K in keyof TNextJSBridgeCommandReturn]: TNextJSBridgeCommandReturn[K][keyof TNextJSBridgeCommandReturn[K]];
}>;
