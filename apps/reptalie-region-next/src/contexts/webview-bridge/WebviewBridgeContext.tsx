'use client';

import ConcreteSubject from '@/utils/observer/Observer';
import { AsyncStorage } from '@/utils/webveiw-bridge/AsyncStorage';
import { Haptic } from '@/utils/webveiw-bridge/Haptic';
import { Navigate } from '@/utils/webveiw-bridge/Navigate';

import {
    IAsyncStorage,
    IHapticInterface,
    INavigate,
    deserializeReturnMessage,
    isWebviewBridgeModule,
} from '@reptalieregion/webview-bridge';
import { createContext, useEffect, PropsWithChildren } from 'react';

type TWebviewBridgeValue = {
    Haptic?: IHapticInterface;
    Navigate?: INavigate;
    AsyncStorage?: IAsyncStorage;
};

export const WebviewBridgeContext = createContext<TWebviewBridgeValue>({});

const subject = new ConcreteSubject();

const makeReturnValue = (event: MessageEvent<any>) => {
    try {
        if (typeof event.data !== 'string') {
            return;
        }

        const message = deserializeReturnMessage(event.data);
        if (!message?.module) {
            return;
        }

        if (isWebviewBridgeModule(message.module)) {
            subject.notifyObservers(message);
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
        Haptic: Haptic(subject),
        Navigate: Navigate(subject),
        AsyncStorage: AsyncStorage(subject),
    };

    return <WebviewBridgeContext.Provider value={webviewBridge}>{children}</WebviewBridgeContext.Provider>;
};

export default WebviewBridgeComponent;
