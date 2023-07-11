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

export interface IAsyncStorage {
    setItem(payload: TSetItem): Promise<void>;
    getItem(payload: TGetItem): Promise<string | null>;
    mergeItem(payload: TMergeItem): Promise<void>;
    removeItem(payload: TRemoveItem): Promise<void>;
    getAllKeys(): Promise<readonly string[]>;
    multiGet: (payload: TMultiGet) => Promise<readonly TKeyValuePair[]>;
    multiSet: (payload: TMultiSet) => Promise<void>;
    multiMerge: (payload: TMultiMerge) => Promise<void>;
    multiRemove: (payload: TMultiRemove) => Promise<void>;
    clear: () => Promise<void>;
}

export type TSetItem = TKeyValuePayload;
export type TGetItem = TKeyPayload;
export type TMergeItem = TKeyValuePayload;
export type TRemoveItem = TKeyPayload;
export type TMultiGet = TKeysPayload;
export type TMultiSet = TKeyValuePairs;
export type TMultiMerge = TKeyValuePairs;
export type TMultiRemove = TKeysPayload;
