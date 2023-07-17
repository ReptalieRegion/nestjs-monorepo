import { BridgeFunction } from '../common/function';

type HapticFeedbackTypes =
    | 'selection'
    | 'impactLight'
    | 'impactMedium'
    | 'impactHeavy'
    | 'rigid'
    | 'soft'
    | 'notificationSuccess'
    | 'notificationWarning'
    | 'notificationError'
    | 'clockTick'
    | 'contextClick'
    | 'keyboardPress'
    | 'keyboardRelease'
    | 'keyboardTap'
    | 'longPress'
    | 'textHandleMove'
    | 'virtualKey'
    | 'virtualKeyRelease'
    | 'effectClick'
    | 'effectDoubleClick'
    | 'effectHeavyClick'
    | 'effectTick';

export type TTriggerPayload = {
    type: HapticFeedbackTypes;
    options?: {
        enableVibrateFallback?: boolean;
        ignoreAndroidSystemSettings?: boolean;
    };
};

export interface IHapticInterface {
    trigger: BridgeFunction<TTriggerPayload, void>;
}
