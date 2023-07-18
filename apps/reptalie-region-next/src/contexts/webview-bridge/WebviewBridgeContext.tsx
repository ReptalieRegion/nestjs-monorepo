'use client';

import ConcreteSubject from '@/utils/observer/Observer';
import { AsyncStorage } from '@/utils/webveiw-bridge/AsyncStorage';
import { Haptic } from '@/utils/webveiw-bridge/Haptic';
import { Navigate } from '@/utils/webveiw-bridge/Navigate';

import { IAsyncStorage, IHapticInterface, INavigate } from '@reptalieregion/webview-bridge';
import { ReactNode, createContext, useEffect } from 'react';

interface WebviewBridgeComponentProps {
    children: ReactNode;
}

type TWebviewBridgeValue = {
    Haptic?: IHapticInterface;
    Navigate?: INavigate;
    AsyncStorage?: IAsyncStorage;
};

export const WebviewBridgeContext = createContext<TWebviewBridgeValue>({});

const subject = new ConcreteSubject();

const WebviewBridgeComponent = ({ children }: WebviewBridgeComponentProps) => {
    useEffect(() => {
        const makeReturnValue = (event: MessageEvent<any>) => {
            try {
                if (typeof event.data !== 'string') {
                    return;
                }

                const message = JSON.parse(event.data);
                if (!message?.module) {
                    return;
                }

                const { module, command, data } = JSON.parse(event.data);
                if (module === 'Haptic' || module === 'Navigation' || module === 'AsyncStorage') {
                    subject.notifyObservers({ module, command, data });
                }
            } catch (error) {
                console.error(error);
            }
        };

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
