export type FunctionArguments<T> = T extends (...args: infer A) => unknown ? A : never;
export type BridgeFunction<ArgumentsType = undefined, ReturnType = void> = (payload: ArgumentsType) => ReturnType;
