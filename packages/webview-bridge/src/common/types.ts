export type FunctionArguments<T> = T extends (...args: infer A) => unknown ? A : never;

export type BridgeFunction<ArgumentsType = undefined, ReturnType = void> = (payload: ArgumentsType) => ReturnType;

export type Unbox<T> = T extends { [K in keyof T]: infer U } ? U : never;

export type PromiseType<T> = T extends Promise<infer U> ? U : T;

export type NotExistsArguments = undefined;

export type VoidTypeChange<T> = T extends void ? undefined : T;
