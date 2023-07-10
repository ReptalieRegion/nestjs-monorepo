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

interface HapticOptions {
    enableVibrateFallback?: boolean;
    ignoreAndroidSystemSettings?: boolean;
}

export interface IHapticInterface {
    trigger: IHapticTrigger;
}

export interface IHapticTrigger {
    (payload: TTriggerPayload): void;
}

export type TTriggerPayload = {
    type: HapticFeedbackTypes;
    options?: HapticOptions;
};
