'use client';

import ConcreteSubject from '@/utils/observer/Observer';
import { Haptic } from '@/utils/webveiw-bridge/Haptic';
import { Navigate } from '@/utils/webveiw-bridge/Navigate';
import WebviewBridge from '@/utils/webveiw-bridge/bridge';
import { IAsyncStorage, IHapticInterface, INavigate } from '@reptalieregion/webview-bridge';
import { ReactNode, createContext, useEffect } from 'react';

interface WebviewBridgeComponentProps {
    children: ReactNode;
}

type TWebviewBridgeValue = {
    Haptic: IHapticInterface;
    Navigate: INavigate;
    AsyncStorage?: IAsyncStorage;
};

const defaultWebviewBridgeValue: TWebviewBridgeValue = {
    Haptic,
    Navigate,
};

export const WebviewBridgeContext = createContext<TWebviewBridgeValue>(defaultWebviewBridgeValue);

const subject = new ConcreteSubject();

const WebviewBridgeComponent = ({ children }: WebviewBridgeComponentProps) => {
    useEffect(() => {
        const makeReturnValue = (event: MessageEvent<any>) => {
            try {
                const data = event.data;
                if (typeof data !== 'string') {
                    return;
                }

                const message = JSON.parse(event.data);
                if (!message?.module) {
                    return;
                }

                const { module, command, result } = JSON.parse(event.data);
                if (module === 'Haptic' || module === 'Navigation' || module === 'AsyncStorage') {
                    subject.notifyObservers({ module, command, returnValue: result });
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

    const webviewBridge = WebviewBridge(subject);

    return <WebviewBridgeContext.Provider value={webviewBridge}>{children}</WebviewBridgeContext.Provider>;
};

export default WebviewBridgeComponent;
