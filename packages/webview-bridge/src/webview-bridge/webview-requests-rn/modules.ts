import { RNMessageType, RNReturnMessageType } from './types';

export type AsyncStorageMessageType = RNMessageType<'AsyncStorage'>;
export type AsyncStorageReturnType = RNReturnMessageType<'AsyncStorage'>;

export type NavigationMessageType = RNMessageType<'Navigation'>;
export type NavigationReturnType = RNReturnMessageType<'Navigation'>;

export type HapticMessageType = RNMessageType<'Haptic'>;
export type HapticReturnType = RNReturnMessageType<'Haptic'>;
