import { BridgeFunction, NotExistsArguments } from '../../common';

type TKeyValuePair = [string, string | null];

type TKeyValuePairs = {
    keyValuePairs: Array<[string, string]>;
};

type TKeysPayload = {
    keys: readonly string[];
};

type TKeyPayload = {
    key: string;
};

type TKeyValuePayload = {
    key: string;
    value: string;
};

export type TSetItem = TKeyValuePayload;
export type TGetItem = TKeyPayload;
export type TMergeItem = TKeyValuePayload;
export type TRemoveItem = TKeyPayload;
export type TMultiGet = TKeysPayload;
export type TMultiSet = TKeyValuePairs;
export type TMultiMerge = TKeyValuePairs;
export type TMultiRemove = TKeysPayload;

export interface IAsyncStorage {
    setItem: BridgeFunction<TSetItem, Promise<void>>;
    getItem: BridgeFunction<TGetItem, Promise<string | null>>;
    mergeItem: BridgeFunction<TMergeItem, Promise<void>>;
    removeItem: BridgeFunction<TRemoveItem, Promise<void>>;
    getAllKeys: BridgeFunction<NotExistsArguments, Promise<readonly string[]>>;
    multiGet: BridgeFunction<TMultiGet, Promise<readonly TKeyValuePair[]>>;
    multiSet: BridgeFunction<TMultiSet, Promise<void>>;
    multiMerge: BridgeFunction<TMultiMerge, Promise<void>>;
    multiRemove: BridgeFunction<TMultiRemove, Promise<void>>;
    clear: BridgeFunction<NotExistsArguments, Promise<void>>;
}
