'use client';

import { AsyncStorage } from '@/utils/webveiw-bridge/AsyncStorage';
import { Haptic } from '@/utils/webveiw-bridge/Haptic';
import { Navigation } from '@/utils/webveiw-bridge/Navigate';
import WebviewBridgeManager from '@/utils/webveiw-bridge/utils/WebviewBridgeManager';

import {
    IAsyncStorage,
    IHaptic,
    INavigation,
    deserializeNextJS,
    isNextModule,
    isRNModule,
} from '@reptalieregion/webview-bridge';
import { createContext, useEffect, PropsWithChildren } from 'react';

type TWebviewBridgeValue = {
    Haptic?: IHaptic;
    Navigation?: INavigation;
    AsyncStorage?: IAsyncStorage;
};

export const WebviewBridgeContext = createContext<TWebviewBridgeValue>({});

const webviewBridgeManager = new WebviewBridgeManager();

const makeReturnValue = (event: MessageEvent<any>) => {
    try {
        if (typeof event.data !== 'string') {
            return;
        }

        const deserialized = deserializeNextJS(event.data);
        if (!deserialized) {
            return;
        }

        const { type, message } = deserialized;
        if (type === 'call' && isNextModule(message.module)) {
            return;
        }

        if (type === 'return' && isRNModule(message.module)) {
            webviewBridgeManager.notifyObservers(message);
        }
    } catch (error) {
        console.error(error);
    }
};

const WebviewBridgeComponent = ({ children }: PropsWithChildren) => {
    useEffect(() => {
        window.addEventListener('message', makeReturnValue);
        return () => {
            window.removeEventListener('message', makeReturnValue);
        };
    }, []);

    const webviewBridge = {
        Haptic: Haptic(webviewBridgeManager),
        Navigation: Navigation(webviewBridgeManager),
        AsyncStorage: AsyncStorage(webviewBridgeManager),
    };

    return <WebviewBridgeContext.Provider value={webviewBridge}>{children}</WebviewBridgeContext.Provider>;
};

export default WebviewBridgeComponent;
